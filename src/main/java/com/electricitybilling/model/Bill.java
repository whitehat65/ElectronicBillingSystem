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
@Table(name = "bills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Bill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bill_id")
    private Integer billId;
    
    @Column(name = "customer_id")
    private Integer customerId;
    
    @Column(name = "period_start", nullable = false)
    private LocalDate periodStart;
    
    @Column(name = "period_end", nullable = false)
    private LocalDate periodEnd;
    
    @Column(name = "units_consumed", precision = 14, scale = 3)
    private BigDecimal unitsConsumed = BigDecimal.ZERO;
    
    @Column(name = "energy_charge", precision = 12, scale = 2)
    private BigDecimal energyCharge = BigDecimal.ZERO;
    
    @Column(name = "fixed_charge", precision = 12, scale = 2)
    private BigDecimal fixedCharge = BigDecimal.ZERO;
    
    @Column(name = "tax_amount", precision = 12, scale = 2)
    private BigDecimal taxAmount = BigDecimal.ZERO;
    
    @Column(name = "other_charges", precision = 12, scale = 2)
    private BigDecimal otherCharges = BigDecimal.ZERO;
    
    @Column(name = "total_amount", precision = 14, scale = 2)
    private BigDecimal totalAmount = BigDecimal.ZERO;
    
    @Column(name = "due_date")
    private LocalDate dueDate;
    
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('GENERATED','SENT','PAID','PARTIALLY_PAID','OVERDUE','CANCELLED')")
    private BillStatus status = BillStatus.GENERATED;
    
    @CreationTimestamp
    @Column(name = "generated_at", updatable = false)
    private LocalDateTime generatedAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "meters", "bills", "payments", "tariff"})
    private Customer customer;
    
    @OneToMany(mappedBy = "bill", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"bill", "customer"})
    private List<Payment> payments;
    
    public enum BillStatus {
        GENERATED, SENT, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED
    }
}
