package com.electricitybilling.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "Meters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Meter {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meter_id")
    private Integer meterId;
    
    @Column(name = "customer_id")
    private Integer customerId;
    
    @Column(name = "meter_no", unique = true, length = 64)
    private String meterNo;
    
    @Column(name = "install_date")
    private LocalDate installDate;
    
    @Column(name = "meter_type", length = 64)
    private String meterType;
    
    @Column(precision = 10, scale = 4)
    private BigDecimal multiplier = BigDecimal.ONE;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('INSTALLED','REPLACED','REMOVED')")
    private MeterStatus status = MeterStatus.INSTALLED;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "meters", "bills", "payments", "tariff"})
    private Customer customer;
    
    @OneToMany(mappedBy = "meter", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"meter", "customer"})
    private List<Reading> readings;
    
    public enum MeterStatus {
        INSTALLED, REPLACED, REMOVED
    }
}
