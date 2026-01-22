package com.electricitybilling.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Customers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Customer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Integer customerId;
    
    @Column(name = "customer_code", unique = true, length = 32)
    private String customerCode;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "connection_no", length = 64)
    private String connectionNo;
    
    @Column(name = "tariff_id")
    private Integer tariffId;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('ACTIVE','SUSPENDED','DISCONNECTED')")
    private CustomerStatus status = CustomerStatus.ACTIVE;
    
    @Column(name = "contact_phone", length = 32)
    private String contactPhone;
    
    @Column(name = "contact_email", length = 255)
    private String contactEmail;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tariff_id", insertable = false, updatable = false)
    @JsonIgnore
    private Tariff tariff;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Meter> meters;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Bill> bills;
    
    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Payment> payments;
    
    public enum CustomerStatus {
        ACTIVE, SUSPENDED, DISCONNECTED
    }
}
