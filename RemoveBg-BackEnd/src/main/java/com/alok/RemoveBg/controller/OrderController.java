package com.alok.RemoveBg.controller;

import com.alok.RemoveBg.dto.OrderDTO;
import com.alok.RemoveBg.response.RemoveBgResponse;
import com.alok.RemoveBg.service.OrderService;
import com.alok.RemoveBg.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    private final OrderService orderService;
    private final RazorpayService razorpayService;

    @PostMapping("/create")  // This makes the full path: /api/orders/create
    public ResponseEntity<?> createOrder(@RequestParam String planId, Authentication authentication) {
        log.info("========== CREATE ORDER REQUEST ==========");
        log.info("Plan ID: {}", planId);
        log.info("Authentication: {}", authentication != null ? authentication.getName() : "null");

        Map<String, Object> responseMap = new HashMap<>();

        try {
            // Check authentication
            if (authentication == null || authentication.getName() == null || authentication.getName().isEmpty()) {
                log.error("Authentication failed - user not authenticated");
                responseMap.put("success", false);
                responseMap.put("message", "User does not have permission");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(responseMap);
            }

            String clerkId = authentication.getName();
            log.info("Creating order for clerkId: {}", clerkId);

            // Create order
            com.razorpay.Order order = orderService.createOrder(planId, clerkId);
            log.info("Order created successfully: {}", order);

            // Convert to DTO
            OrderDTO orderDTO = convertToDto(order);

            // Return success response
            responseMap.put("success", true);
            responseMap.put("data", orderDTO);

            log.info("========== CREATE ORDER SUCCESS ==========");
            return ResponseEntity.status(HttpStatus.CREATED).body(responseMap);

        } catch (IllegalArgumentException e) {
            log.error("Invalid argument: {}", e.getMessage());
            responseMap.put("success", false);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(responseMap);

        } catch (Exception e) {
            log.error("Error creating order: ", e);
            responseMap.put("success", false);
            responseMap.put("message", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOrder(@RequestBody Map<String, Object> request) {
        log.info("========== VERIFY ORDER REQUEST ==========");
        log.info("Request: {}", request);

        Map<String, Object> responseMap = new HashMap<>();

        try {
            String razorpayOrderId = request.get("razorpay_order_id").toString();
            log.info("Verifying order: {}", razorpayOrderId);

            Map<String, Object> result = razorpayService.verifyPayment(razorpayOrderId);
            log.info("Verification result: {}", result);

            return ResponseEntity.status(HttpStatus.OK).body(result);

        } catch (Exception e) {
            log.error("Error verifying order: ", e);
            responseMap.put("success", false);
            responseMap.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseMap);
        }
    }

    private OrderDTO convertToDto(com.razorpay.Order order) {
        try {
            return OrderDTO.builder()
                    .id(order.get("id"))
                    .amount(order.get("amount"))
                    .currency(order.get("currency"))
                    .status(order.get("status"))
                    .entity(order.get("entity"))
                    .created_at(order.get("created_at"))
                    .receipt(order.get("receipt"))
                    .build();
        } catch (Exception e) {
            log.error("Error converting order to DTO: ", e);
            return null;
        }
    }
}