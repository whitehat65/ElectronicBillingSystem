package com.electricitybilling.service;

import com.electricitybilling.dto.LoginRequest;
import com.electricitybilling.dto.LoginResponse;
import com.electricitybilling.model.User;
import com.electricitybilling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        return new LoginResponse(
            user.getUserId(),
            user.getUsername(),
            user.getFullName(),
            user.getRole().toString(),
            user.getEmail(),
            "token-placeholder" // We'll implement JWT token generation
        );
    }
    
    public User register(User user, String password) {
        user.setPasswordHash(passwordEncoder.encode(password));
        if (user.getRole() == null) {
            user.setRole(User.UserRole.VIEWER);
        }
        return userRepository.save(user);
    }
}
