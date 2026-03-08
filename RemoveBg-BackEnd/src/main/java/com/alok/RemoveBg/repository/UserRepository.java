package com.alok.RemoveBg.repository;

import com.alok.RemoveBg.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByClerkId(String clerkId);

    boolean existsByClerkId(String clerkId);

}
