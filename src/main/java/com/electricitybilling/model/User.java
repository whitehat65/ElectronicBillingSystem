package com.electricitybilling.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;
    
    @Column(unique = true, length = 128)
    private String username;
    
    @Column(name = "password_hash", length = 255)
    private String passwordHash;
    
    @Column(name = "full_name", length = 255)
    private String fullName;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ADMIN','BILLING','VIEWER')")
    private UserRole role = UserRole.VIEWER;
    
    @Column(length = 255)
    private String email;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "user")
    private List<AuditLog> auditLogs;
    
    public enum UserRole {
        ADMIN, BILLING, VIEWER
    }
}
