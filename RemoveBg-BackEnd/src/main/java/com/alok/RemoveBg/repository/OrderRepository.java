package com.alok.RemoveBg.repository;

import com.alok.RemoveBg.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {
      Optional<Order> findByOrderId(String orderId);

}
