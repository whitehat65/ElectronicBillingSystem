package com.electricitybilling.controller;

import com.electricitybilling.model.Reading;
import com.electricitybilling.repository.ReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/readings")
@CrossOrigin(origins = "*")
public class ReadingController {
    
    @Autowired
    private ReadingRepository readingRepository;
    
    @GetMapping
    public ResponseEntity<List<Reading>> getAllReadings(@RequestParam(required = false) Integer meter_id) {
        if (meter_id != null) {
            return ResponseEntity.ok(readingRepository.findByMeterIdOrderByReadingDateDesc(meter_id));
        }
        return ResponseEntity.ok(readingRepository.findAll());
    }
    
    @PostMapping
    public ResponseEntity<?> createReading(@RequestBody Reading reading) {
        try {
            Reading created = readingRepository.save(reading);
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to create reading"));
        }
    }
}
