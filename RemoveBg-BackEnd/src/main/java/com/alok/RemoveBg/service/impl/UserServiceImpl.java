package com.alok.RemoveBg.service.impl;

import com.alok.RemoveBg.dto.UserDTO;
import com.alok.RemoveBg.entity.User;
import com.alok.RemoveBg.repository.UserRepository;
import com.alok.RemoveBg.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserDTO saveUser(UserDTO userDTO) {
    Optional<User> user = userRepository.findByClerkId(userDTO.getClerkId());
    if(user.isPresent()){
        User existingUser = user.get();
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setFirstName(userDTO.getFirstName());
        existingUser.setLastName(userDTO.getLastName());
        existingUser.setPhotoUrl(userDTO.getPhotoUrl());
        if(userDTO.getCredits() != null){
            existingUser.setCredits(userDTO.getCredits());
        }
        existingUser = userRepository.save(existingUser);
        return mapToDTO(existingUser);
    }
    User newUser = mapToEntity(userDTO);
    userRepository.save(newUser);
     return mapToDTO(newUser);
    }
    @Override
    public UserDTO getUserByClerkId(String clerkId) {
        log.info("Fetching user by clerkId: {}", clerkId);
        User user = userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> {
                    log.error("User not found with clerkId: {}", clerkId);
                    return new UsernameNotFoundException("User not found");
                });
        log.info("User found with credits: {}", user.getCredits());
        return mapToDTO(user);
    }

    @Override
    public void deleteUserByClerkId(String clerkId) {
        User user = userRepository.findByClerkId(clerkId).orElseThrow(()-> new UsernameNotFoundException("user not found"));
         userRepository.delete(user);
    }

    private UserDTO mapToDTO(User newUser) {
       return UserDTO.builder()
                .clerkId(newUser.getClerkId())
                .email(newUser.getEmail())
                .firstName(newUser.getFirstName())
                .lastName(newUser.getLastName())
                .photoUrl(newUser.getPhotoUrl())
                .credits(newUser.getCredits())
               .build();
    }

    private User mapToEntity(UserDTO userDTO) {
      return User.builder()
                .clerkId(userDTO.getClerkId())
                .email(userDTO.getEmail())
                .firstName(userDTO.getFirstName())
                .lastName(userDTO.getLastName())
                .photoUrl(userDTO.getPhotoUrl())
                .build();
    }
}
