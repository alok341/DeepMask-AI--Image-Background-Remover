package com.alok.RemoveBg.controller;


import com.alok.RemoveBg.dto.UserDTO;
import com.alok.RemoveBg.entity.User;
import com.alok.RemoveBg.response.RemoveBgResponse;
import com.alok.RemoveBg.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
@Slf4j
public class clerkWebhookController {

    @Value("${clerk.webhooks-secret-key")
    private String webhookSecret;

    private final UserService userService;
    @PostMapping("/clerk")
    public ResponseEntity handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                             @RequestHeader("svix-timestamp") String svixTimestamp,
                                             @RequestHeader("svix-signature") String svixSignature,
                                             @RequestBody String payload){
        // Log everything
        log.info("=== WEBHOOK RECEIVED ===");
        log.info("svix-id: {}", svixId);
        log.info("svix-timestamp: {}", svixTimestamp);
        log.info("svix-signature: {}", svixSignature);
        log.info("payload: {}", payload);

        try{
          boolean isValid =  verifyWebhookSignature(svixId,svixTimestamp,svixSignature,payload);
            log.info("Signature valid: {}", isValid);
          if(!isValid){
           RemoveBgResponse response =RemoveBgResponse.builder()
                      .success(false)
                      .statusCode(HttpStatus.UNAUTHORIZED)
                      .data("Invalid webhook signature")
                      .build();
           return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
          }
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode rootNode = objectMapper.readTree(payload);

            String eventType = rootNode.path("type").asText();
            switch (eventType){
                case "user.created" :
                    handleUserCreated(rootNode.path("data"));
                    break;

                case "user.updated" :
                    handleUserUpdated(rootNode.path("data"));
                    break;

                case "user.deleted" :
                    handleUserDeleted(rootNode.path("data"));
                    break;
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            RemoveBgResponse response =RemoveBgResponse.builder()
                    .success(false)
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                    .data("Something went wrong")
                    .build();
       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private void handleUserDeleted(JsonNode data) {
      String clerkId = data.path("id").asText();
      userService.deleteUserByClerkId(clerkId);
    }

    private void handleUserUpdated(JsonNode data) {
       String clerkId = data.path("id").asText();
      UserDTO existingUser = userService.getUserByClerkId(clerkId);
      existingUser.setEmail(data.path("email_addresses").path(0).path("email_address").asText());
      existingUser.setFirstName(data.path("first_name").asText());
      existingUser.setLastName(data.path("last_name").asText());
      existingUser.setPhotoUrl(data.path("image_url").asText());
      userService.saveUser(existingUser);

    }

    private void handleUserCreated(JsonNode data) {
      UserDTO newUser = UserDTO.builder()
                .clerkId(data.path("id").asText())
                .email(data.path("email_addresses").path(0).path("email_address").asText())
                .firstName(data.path("first_name").asText())
                .lastName(data.path("last_name").asText())
                .build();
      userService.saveUser(newUser);

    }

    private boolean verifyWebhookSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {

        try {
            return true; // For testing only - remove this later!
        } catch (Exception e) {
            log.error("Signature verification failed", e);
            return false;
        }
    }
}
