package com.electricitybilling.controller;

import com.electricitybilling.dto.DashboardResponse;
import com.electricitybilling.model.Bill;
import com.electricitybilling.model.Customer;
import com.electricitybilling.repository.BillRepository;
import com.electricitybilling.repository.CustomerRepository;
import com.electricitybilling.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private BillRepository billRepository;
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> getDashboard() {
        Long totalCustomers = customerRepository.count();
        Long totalBills = billRepository.count();
        
        List<Bill.BillStatus> unpaidStatuses = Arrays.asList(
            Bill.BillStatus.GENERATED, 
            Bill.BillStatus.SENT, 
            Bill.BillStatus.OVERDUE
        );
        Long unpaidBills = billRepository.findAll().stream()
            .filter(b -> unpaidStatuses.contains(b.getStatus()))
            .count();
        
        BigDecimal totalRevenue = paymentRepository.findAll().stream()
            .map(p -> p.getAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal outstandingAmount = billRepository.findAll().stream()
            .filter(b -> unpaidStatuses.contains(b.getStatus()) || b.getStatus() == Bill.BillStatus.PARTIALLY_PAID)
            .map(b -> b.getTotalAmount())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        DashboardResponse response = new DashboardResponse(
            totalCustomers, 
            totalBills, 
            unpaidBills, 
            totalRevenue, 
            outstandingAmount
        );
        
        return ResponseEntity.ok(response);
    }
}
