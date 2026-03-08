package com.alok.RemoveBg.service.impl;

import com.alok.RemoveBg.dto.UserDTO;
import com.alok.RemoveBg.repository.OrderRepository;
import com.alok.RemoveBg.service.RazorpayService;
import com.alok.RemoveBg.service.UserService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    @Value("${razorpay.key.id}")
    private String razorpayId;
    @Value("${razorpay.key.secret}")
    private String razorpayKey;

    private final OrderRepository orderRepository;

    private final UserService userService;

    @Override
    public Order createOrder(Double amount, String currency) throws RazorpayException {
        try{
            RazorpayClient razorpayClient = new RazorpayClient(razorpayId,razorpayKey);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amount * 100);
            orderRequest.put("currency",currency);
            orderRequest.put("receipt","order_rcptid"+System.currentTimeMillis());
            orderRequest.put("payment_capture",1);
            return razorpayClient.orders.create(orderRequest);
        }
        catch (RazorpayException e){
            e.printStackTrace();
            throw new RazorpayException("Razorpay error"+e.getMessage());
        }
    }

    @Override
    public Map<String, Object> verifyPayment(String razorpayOrderId) throws RazorpayException {
      Map<String,Object> returnValue =  new HashMap<>();
      try{
          RazorpayClient razorpayClient = new RazorpayClient(razorpayId,razorpayKey);
          Order orderInfo = razorpayClient.orders.fetch(razorpayOrderId);
          if(orderInfo.get("status").toString().equalsIgnoreCase("paid")){
             com.alok.RemoveBg.entity.Order existingOrder = orderRepository.findByOrderId(razorpayOrderId)
                     .orElseThrow(()->new RuntimeException("Order not found:"+razorpayOrderId));

             if(existingOrder.getPayment()){
                 returnValue.put("message","Payment failed");
                 returnValue.put("success",false);
                 return returnValue;
             }
              UserDTO userDTO = userService.getUserByClerkId(existingOrder.getClerkId());
             userDTO.setCredits(userDTO.getCredits() + existingOrder.getCredits());

             userService.saveUser(userDTO);
             existingOrder.setPayment(true);

             orderRepository.save(existingOrder);
             returnValue.put("success",true);
             returnValue.put("message","Credits added");
             return returnValue;

          }
      } catch (RazorpayException e) {
          e.printStackTrace();
          throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Error while verifying the order");

      }
      return returnValue;

    }


}
