package com.alok.RemoveBg.service.impl;

import com.alok.RemoveBg.client.ClipDropClient;
import com.alok.RemoveBg.service.RemoveBackgroundService;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class RemoveBackgroundServiceImpl implements RemoveBackgroundService {

    @Value("${clipdrop.api-key}")
    private String apiKey;

    private final ClipDropClient client;

    @Override
    public byte[] removeBackground(MultipartFile file) {
        log.info("========== CLIPDROP SERVICE CALL ==========");
        log.info("API Key present: {}", apiKey != null && !apiKey.isEmpty());
        log.info("API Key length: {}", apiKey != null ? apiKey.length() : 0);
        log.info("File received in service: {}", file.getOriginalFilename());
        log.info("File size: {} bytes", file.getSize());
        log.info("File content type: {}", file.getContentType());

        try {
            // Validate file
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File is empty");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("File must be an image. Received: " + contentType);
            }

            // Log first few bytes of API key for debugging (don't log full key)
            String apiKeyPreview = apiKey != null && apiKey.length() > 10 ?
                    apiKey.substring(0, 10) + "..." : "invalid";
            log.info("API Key preview: {}", apiKeyPreview);

            log.info("Calling ClipDropClient with endpoint: /remove-background/v1");
            log.info("Full URL: https://clipdrop-api.co/remove-background/v1");

            byte[] result = client.removeBackground(file, apiKey);

            log.info("ClipDropClient returned successfully");
            log.info("Result size: {} bytes", result.length);

            if (result.length == 0) {
                log.error("Clipdrop returned empty response");
                throw new RuntimeException("Clipdrop API returned empty response");
            }

            log.info("========== CLIPDROP SERVICE CALL SUCCESS ==========");
            return result;

        } catch (FeignException e) {
            log.error("FeignException in ClipDropClient call");
            log.error("Status: {}", e.status());
            log.error("Message: {}", e.getMessage());
            log.error("Content: {}", e.contentUTF8());

            String errorMsg = "Clipdrop API error";
            if (e.status() == 404) {
                errorMsg = "Clipdrop API endpoint not found (404). Check the URL.";
            } else if (e.status() == 401) {
                errorMsg = "Invalid Clipdrop API key (401)";
            } else if (e.status() == 403) {
                errorMsg = "Access forbidden to Clipdrop API (403)";
            } else if (e.status() == 429) {
                errorMsg = "Clipdrop API rate limit exceeded (429)";
            } else if (e.status() >= 500) {
                errorMsg = "Clipdrop API server error (" + e.status() + ")";
            }

            throw new RuntimeException(errorMsg + ": " + e.contentUTF8(), e);

        } catch (Exception e) {
            log.error("Unexpected error in ClipDropClient call: ", e);
            throw new RuntimeException("Failed to remove background: " + e.getMessage(), e);
        }
    }
}