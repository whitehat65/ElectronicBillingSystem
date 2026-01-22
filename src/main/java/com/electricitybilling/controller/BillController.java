package com.electricitybilling.controller;

import com.electricitybilling.dto.BillGenerateRequest;
import com.electricitybilling.model.Bill;
import com.electricitybilling.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {
    
    @Autowired
    private BillService billService;
    
    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills(
            @RequestParam(required = false) Integer customer_id,
            @RequestParam(required = false) String status) {
        
        if (customer_id != null) {
            return ResponseEntity.ok(billService.getBillsByCustomerId(customer_id));
        }
        return ResponseEntity.ok(billService.getAllBills());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBillById(@PathVariable Integer id) {
        return billService.getBillById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.status(404).body(null));
    }
    
    @PostMapping("/generate")
    public ResponseEntity<?> generateBill(@RequestBody BillGenerateRequest request) {
        try {
            Bill bill = billService.generateBill(request);
            return ResponseEntity.status(201).body(bill);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Failed to generate bill", "details", e.getMessage()));
        }
    }
}
