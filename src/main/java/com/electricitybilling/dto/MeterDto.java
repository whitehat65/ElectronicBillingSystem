package com.electricitybilling.dto;

import com.electricitybilling.model.Meter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MeterDto(
        Integer meterId,
        Integer customerId,
        String meterNo,
        LocalDate installDate,
        String meterType,
        BigDecimal multiplier,
        Meter.MeterStatus status,
        LocalDateTime createdAt
) {
    public static MeterDto fromEntity(Meter meter) {
        if (meter == null) return null;
        return new MeterDto(
                meter.getMeterId(),
                meter.getCustomerId(),
                meter.getMeterNo(),
                meter.getInstallDate(),
                meter.getMeterType(),
                meter.getMultiplier(),
                meter.getStatus(),
                meter.getCreatedAt()
        );
    }
}
