package com.electricitybilling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardResponse {
    private Long totalCustomers;
    private Long totalBills;
    private Long unpaidBills;
    private BigDecimal totalRevenue;
    private BigDecimal outstandingAmount;
}
