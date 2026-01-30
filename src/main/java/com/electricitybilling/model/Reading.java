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

@Entity
@Table(name = "Readings", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"meter_id", "reading_date"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reading {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reading_id")
    private Integer readingId;
    
    @Column(name = "meter_id", nullable = false)
    private Integer meterId;
    
    @Column(name = "reading_date", nullable = false)
    private LocalDate readingDate;
    
    @Column(name = "reading_value", nullable = false, precision = 14, scale = 3)
    private BigDecimal readingValue;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "meter_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "customer", "readings"})
    private Meter meter;
}
