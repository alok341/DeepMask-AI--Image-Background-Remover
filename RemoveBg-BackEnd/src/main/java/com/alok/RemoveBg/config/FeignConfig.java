package com.alok.RemoveBg.config;

import feign.Logger;
import feign.codec.ErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    public ErrorDecoder errorDecoder() {
        return (methodKey, response) -> {
            String errorMessage = String.format(
                    "Clipdrop API error - Status: %s, Method: %s, URL: %s",
                    response.status(),
                    methodKey,
                    response.request().url()
            );

            // Try to read error body
            if (response.body() != null) {
                try {
                    String body = new String(response.body().asInputStream().readAllBytes());
                    errorMessage += ", Body: " + body;
                } catch (Exception e) {
                    // Ignore
                }
            }

            return new RuntimeException(errorMessage);
        };
    }
}