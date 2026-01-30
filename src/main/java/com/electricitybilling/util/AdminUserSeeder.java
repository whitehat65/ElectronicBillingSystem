package com.electricitybilling.util;

import com.electricitybilling.model.User;
import com.electricitybilling.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Database seed utility to ensure admin user exists with correct credentials
 * Run this once to initialize/fix the admin user
 */
@Component
@Profile("!local") // Run for all profiles except local
public class AdminUserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("========================================");
        System.out.println("Checking Admin User...");
        System.out.println("========================================");

        // Check if admin user exists
        var adminOptional = userRepository.findByUsername("admin");

        if (adminOptional.isEmpty()) {
            // Create admin user
            User admin = new User();
            admin.setUsername("admin");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(User.UserRole.ADMIN);
            admin.setEmail("admin@ebsystem.com");

            userRepository.save(admin);

            System.out.println("✓ Admin user created successfully!");
        } else {
            // Update existing admin user password to ensure it's correct
            User admin = adminOptional.get();
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setFullName("System Administrator");
            admin.setRole(User.UserRole.ADMIN);
            admin.setEmail("admin@ebsystem.com");

            userRepository.save(admin);

            System.out.println("✓ Admin user updated successfully!");
        }

        System.out.println("========================================");
        System.out.println("Login Credentials:");
        System.out.println("Username: admin");
        System.out.println("Password: admin123");
        System.out.println("========================================\n");
    }
}
