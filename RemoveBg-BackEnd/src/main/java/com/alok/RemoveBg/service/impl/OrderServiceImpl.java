package com.alok.RemoveBg.service.impl;

import com.alok.RemoveBg.repository.OrderRepository;
import com.alok.RemoveBg.service.OrderService;
import com.alok.RemoveBg.service.RazorpayService;
import com.alok.RemoveBg.service.UserService;
import com.razorpay.Order;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final RazorpayService razorpayService;
    private final OrderRepository orderRepository;

    private static final Map<String, PlanDetails> PLAN_DETAILS_MAP = Map.of(
            "Basic", new PlanDetails("Basic", 20, 99),
            "Premium", new PlanDetails("Premium", 50, 199),
            "Ultimate", new PlanDetails("Ultimate", 100, 349)
    );

    private record PlanDetails(String name, int credits, double amount) {}

    @Override
    public Order createOrder(String planId, String clerkId) throws RazorpayException {
        // Extract the base plan name (remove " Package" if present)
        String basePlanId = planId.replace(" Package", "");

        PlanDetails details = PLAN_DETAILS_MAP.get(basePlanId);
        if (details == null) {
            throw new IllegalArgumentException("Invalid PlanId: " + planId);
        }

        try {
            com.razorpay.Order order = razorpayService.createOrder(details.amount(), "INR");

            com.alok.RemoveBg.entity.Order newOrder = com.alok.RemoveBg.entity.Order.builder()
                    .clerkId(clerkId)
                    .plan(details.name())
                    .credits(details.credits())
                    .amount(details.amount())
                    .orderId(order.get("id"))
                    .build();

            orderRepository.save(newOrder);
            return order;

        } catch (Exception e) {
            throw new RazorpayException("Error while creating the order", e);
        }
    }
}