package com.alok.RemoveBg.controller;

import com.alok.RemoveBg.dto.UserDTO;
import com.alok.RemoveBg.service.RemoveBackgroundService;
import com.alok.RemoveBg.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
@Slf4j
public class RemoveBackgroundController {

    private final RemoveBackgroundService removeBackgroundService;
    private final UserService userService;

    @PostMapping(value = "/remove-background", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> removeBackground(@RequestParam("file") MultipartFile multipartFile, Authentication authentication) {

        log.info("========== BACKGROUND REMOVAL REQUEST START ==========");
        log.info("Request received at: {}", java.time.LocalDateTime.now());

        Map<String, Object> responseMap = new HashMap<>();

        try {
            // Log authentication details
            log.info("Authentication: {}", authentication);
            if (authentication != null) {
                log.info("Authenticated user: {}", authentication.getName());
                log.info("Authentication authorities: {}", authentication.getAuthorities());
            } else {
                log.error("Authentication is null");
            }

            // Check authentication
            if (authentication == null || authentication.getName() == null || authentication.getName().isEmpty()) {
                log.error("Authentication failed - user not authenticated");
                responseMap.put("success", false);
                responseMap.put("message", "User does not have access/permission to this resource");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseMap);
            }

            String clerkId = authentication.getName();
            log.info("Processing request for clerkId: {}", clerkId);

            // Validate file
            if (multipartFile == null || multipartFile.isEmpty()) {
                log.error("File is empty or null");
                responseMap.put("success", false);
                responseMap.put("message", "File is empty");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
            }

            // Log file details
            log.info("File details:");
            log.info("  - Original filename: {}", multipartFile.getOriginalFilename());
            log.info("  - Content type: {}", multipartFile.getContentType());
            log.info("  - Size: {} bytes ({} KB)", multipartFile.getSize(), multipartFile.getSize() / 1024.0);

            // Check file type
            String contentType = multipartFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                log.error("Invalid file type: {}", contentType);
                responseMap.put("success", false);
                responseMap.put("message", "File must be an image");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
            }

            // Check file size (30MB max as per Clipdrop)
            long maxSize = 30 * 1024 * 1024; // 30MB
            if (multipartFile.getSize() > maxSize) {
                log.error("File too large: {} bytes", multipartFile.getSize());
                responseMap.put("success", false);
                responseMap.put("message", "File size exceeds 30MB limit");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
            }

            // Get user and check credits
            log.info("Fetching user from database for clerkId: {}", clerkId);
            UserDTO userDTO = userService.getUserByClerkId(clerkId);
            log.info("Current credits: {}", userDTO.getCredits());

            if (userDTO.getCredits() == null || userDTO.getCredits() < 2) {
                log.warn("Insufficient credits for user: {}", clerkId);
                responseMap.put("success", false);
                responseMap.put("message", "Insufficient credits. Need 2 credits for background removal.");
                responseMap.put("currentCredits", userDTO.getCredits() != null ? userDTO.getCredits() : 0);
                responseMap.put("requiredCredits", 2);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);
            }

            // Call Clipdrop API
            log.info("Calling Clipdrop API to remove background...");
            long startTime = System.currentTimeMillis();

            byte[] imageBytes = removeBackgroundService.removeBackground(multipartFile);

            long endTime = System.currentTimeMillis();
            log.info("Clipdrop API responded in {} ms", (endTime - startTime));
            log.info("Response image size: {} bytes", imageBytes.length);

            // Determine content type from the original file
            MediaType responseMediaType;
            if (contentType != null) {
                if (contentType.contains("png")) {
                    responseMediaType = MediaType.IMAGE_PNG;
                } else if (contentType.contains("jpeg") || contentType.contains("jpg")) {
                    responseMediaType = MediaType.IMAGE_JPEG;
                } else if (contentType.contains("gif")) {
                    responseMediaType = MediaType.IMAGE_GIF;
                } else if (contentType.contains("webp")) {
                    responseMediaType = MediaType.valueOf("image/webp");
                } else {
                    responseMediaType = MediaType.IMAGE_PNG; // default to PNG
                }
            } else {
                responseMediaType = MediaType.IMAGE_PNG; // default
            }

            log.info("Original content type: {}, Responding with: {}", contentType, responseMediaType);

            // Update credits (deduct 2)
            int oldCredits = userDTO.getCredits();
            int newCredits = oldCredits - 2;
            userDTO.setCredits(newCredits);
            log.info("Updating credits: {} -> {}", oldCredits, newCredits);

            UserDTO savedUser = userService.saveUser(userDTO);
            log.info("User updated successfully. New credit balance: {}", savedUser.getCredits());

            log.info("========== BACKGROUND REMOVAL REQUEST COMPLETED SUCCESSFULLY ==========");

            // Return the image with appropriate content type
            return ResponseEntity.ok()
                    .contentType(responseMediaType)
                    .body(imageBytes);

        } catch (IllegalArgumentException e) {
            log.error("Invalid argument: {}", e.getMessage());
            responseMap.put("success", false);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);

        } catch (Exception e) {
            log.error("========== ERROR IN BACKGROUND REMOVAL ==========");
            log.error("Exception type: {}", e.getClass().getName());
            log.error("Exception message: {}", e.getMessage());
            log.error("Stack trace: ", e);

            String errorMessage = "Something went wrong";
            if (e.getMessage() != null) {
                if (e.getMessage().contains("API key")) {
                    errorMessage = "Invalid Clipdrop API key configuration";
                } else if (e.getMessage().contains("404")) {
                    errorMessage = "Clipdrop API endpoint not found";
                } else if (e.getMessage().contains("401")) {
                    errorMessage = "Unauthorized: Invalid API key";
                } else if (e.getMessage().contains("429")) {
                    errorMessage = "Rate limit exceeded. Try again later";
                } else {
                    errorMessage = e.getMessage();
                }
            }

            responseMap.put("success", false);
            responseMap.put("message", errorMessage);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(responseMap);
        }
    }
}