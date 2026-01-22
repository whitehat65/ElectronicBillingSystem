package com.electricitybilling.controller;

import com.electricitybilling.dto.LoginRequest;
import com.electricitybilling.dto.LoginResponse;
import com.electricitybilling.model.User;
import com.electricitybilling.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401)
                .body(Map.of("error", "Invalid credentials"));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            User user = new User();
            user.setUsername(request.get("username"));
            user.setFullName(request.get("full_name"));
            user.setEmail(request.get("email"));
            
            String role = request.get("role");
            if (role != null) {
                user.setRole(User.UserRole.valueOf(role));
            }
            
            User savedUser = authService.register(user, request.get("password"));
            
            return ResponseEntity.status(201).body(Map.of(
                "user_id", savedUser.getUserId(),
                "username", savedUser.getUsername(),
                "full_name", savedUser.getFullName(),
                "role", savedUser.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to create user"));
        }
    }
}
