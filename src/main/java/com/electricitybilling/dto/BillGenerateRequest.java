package com.electricitybilling.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class BillGenerateRequest {
    private Integer customerId;
    private LocalDate periodStart;
    private LocalDate periodEnd;
}
