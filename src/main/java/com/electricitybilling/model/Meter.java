package com.electricitybilling.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "Meters")
@Data
@NoArgsConstructor
@AllArgsConstructor
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"customer","readings","hibernateLazyInitializer","handler"})
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
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    @JsonIgnore
    private Customer customer;
    
    @OneToMany(mappedBy = "meter", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Reading> readings;
    
    public enum MeterStatus {
        INSTALLED, REPLACED, REMOVED
    }
}
