package com.electricitybilling.controller;

import com.electricitybilling.dto.MeterDto;
import com.electricitybilling.model.Meter;
import com.electricitybilling.repository.MeterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meters")
@CrossOrigin(origins = "*")
public class MeterController {
    
    @Autowired
    private MeterRepository meterRepository;
    
    @GetMapping
    public ResponseEntity<List<MeterDto>> getAllMeters() {
        List<MeterDto> meters = meterRepository.findAll()
            .stream()
            .map(MeterDto::fromEntity)
            .collect(Collectors.toList());
        return ResponseEntity.ok(meters);
    }
    
    @PostMapping
    public ResponseEntity<?> createMeter(@RequestBody Meter meter) {
        try {
            Meter created = meterRepository.save(meter);
            return ResponseEntity.status(201).body(MeterDto.fromEntity(created));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to create meter"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeter(@PathVariable Integer id, @RequestBody Meter meterDetails) {
        try {
            Meter meter = meterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meter not found"));
            
            if (meterDetails.getMeterNo() != null) meter.setMeterNo(meterDetails.getMeterNo());
            if (meterDetails.getInstallDate() != null) meter.setInstallDate(meterDetails.getInstallDate());
            if (meterDetails.getMeterType() != null) meter.setMeterType(meterDetails.getMeterType());
            if (meterDetails.getMultiplier() != null) meter.setMultiplier(meterDetails.getMultiplier());
            if (meterDetails.getStatus() != null) meter.setStatus(meterDetails.getStatus());
            
            Meter saved = meterRepository.save(meter);
            return ResponseEntity.ok(MeterDto.fromEntity(saved));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Meter not found"));
        }
    }
}
