package com.alok.RemoveBg.controller;

import com.alok.RemoveBg.dto.UserDTO;
import com.alok.RemoveBg.response.RemoveBgResponse;
import com.alok.RemoveBg.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
 private final UserService userService;

 @PostMapping
 public ResponseEntity<?> createOrUpdate(@RequestBody UserDTO userDTO, Authentication authentication){
   try{
       if(!authentication.getName().equals(userDTO.getClerkId())){
         RemoveBgResponse response = RemoveBgResponse.builder()
                   .success(false)
                   .data("User does not have permission to access the resource")
                   .statusCode(HttpStatus.FORBIDDEN)
                   .build();

         return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
       }
       UserDTO user = userService.saveUser(userDTO);
       RemoveBgResponse response =  RemoveBgResponse.builder()
               .success(true)
               .data(user)
               .statusCode(HttpStatus.OK)
               .build();
       return ResponseEntity.status(HttpStatus.OK).body(response);
   }catch (Exception e){

       RemoveBgResponse response = RemoveBgResponse.builder()
               .success(false)
               .data(e.getMessage())
               .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
               .build();
       return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
   }
 }

 @GetMapping("/credits")
 public ResponseEntity<?> getUserCredits(Authentication authentication){
     try{
       if(authentication.getName().isEmpty() || authentication.getName()==null ){
           RemoveBgResponse response = RemoveBgResponse.builder()
                   .data("User do not have permission or access to this resource")
                   .statusCode(HttpStatus.FORBIDDEN)
                   .success(false)
                   .build();
           return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
       }
       String clerkId = authentication.getName();
       UserDTO existingUser = userService.getUserByClerkId(clerkId);
         Map<String,Integer> map = new HashMap<>();
         map.put("credits",existingUser.getCredits());
         RemoveBgResponse response = RemoveBgResponse.builder()
                 .data(map)
                 .statusCode(HttpStatus.OK)
                 .success(true)
                 .build();
        return ResponseEntity.status(HttpStatus.OK).body(response);
     }catch (Exception e){
         RemoveBgResponse response = RemoveBgResponse.builder()
                 .data("Something went wrong.")
                 .statusCode(HttpStatus.INTERNAL_SERVER_ERROR)
                 .success(false)
                 .build();
       return   ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
     }
 }

}
