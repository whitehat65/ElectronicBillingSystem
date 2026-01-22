package com.electricitybilling.controller;

import com.electricitybilling.model.Tariff;
import com.electricitybilling.repository.TariffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tariffs")
@CrossOrigin(origins = "*")
public class TariffController {
    
    @Autowired
    private TariffRepository tariffRepository;
    
    @GetMapping
    public ResponseEntity<List<Tariff>> getAllTariffs() {
        return ResponseEntity.ok(tariffRepository.findAll());
    }
    
    @PostMapping
    public ResponseEntity<?> createTariff(@RequestBody Tariff tariff) {
        try {
            Tariff created = tariffRepository.save(tariff);
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to create tariff"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTariff(@PathVariable Integer id, @RequestBody Tariff tariffDetails) {
        try {
            Tariff tariff = tariffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tariff not found"));
            
            if (tariffDetails.getName() != null) tariff.setName(tariffDetails.getName());
            if (tariffDetails.getDescription() != null) tariff.setDescription(tariffDetails.getDescription());
            if (tariffDetails.getTariffJson() != null) tariff.setTariffJson(tariffDetails.getTariffJson());
            if (tariffDetails.getFixedCharge() != null) tariff.setFixedCharge(tariffDetails.getFixedCharge());
            
            return ResponseEntity.ok(tariffRepository.save(tariff));
        } catch (Exception e) {
            return ResponseEntity.status(404)
                .body(Map.of("error", "Tariff not found"));
        }
    }
}
