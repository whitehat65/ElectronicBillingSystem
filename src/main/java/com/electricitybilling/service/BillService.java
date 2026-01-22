package com.electricitybilling.service;

import com.electricitybilling.dto.BillGenerateRequest;
import com.electricitybilling.model.*;
import com.electricitybilling.repository.*;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class BillService {
    
    @Autowired
    private BillRepository billRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private MeterRepository meterRepository;
    
    @Autowired
    private ReadingRepository readingRepository;
    
    @Autowired
    private TariffRepository tariffRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
    
    public Optional<Bill> getBillById(Integer id) {
        return billRepository.findById(id);
    }
    
    public List<Bill> getBillsByCustomerId(Integer customerId) {
        return billRepository.findByCustomerIdOrderByPeriodEndDesc(customerId);
    }
    
    public Bill generateBill(BillGenerateRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        List<Meter> meters = meterRepository.findByCustomerId(request.getCustomerId());
        if (meters.isEmpty()) {
            throw new RuntimeException("No meter found for customer");
        }
        
        Meter meter = meters.get(0); // Use first meter
        
        // Get readings for the period
        List<Reading> readings = readingRepository.findByMeterIdBeforeDate(
            meter.getMeterId(), 
            request.getPeriodEnd()
        );
        
        if (readings.size() < 2) {
            throw new RuntimeException("Insufficient readings for billing period");
        }
        
        // Get start and end readings
        BigDecimal startReading = readings.get(readings.size() - 1).getReadingValue();
        BigDecimal endReading = readings.get(0).getReadingValue();
        
        BigDecimal unitsConsumed = endReading.subtract(startReading)
            .multiply(meter.getMultiplier())
            .setScale(3, RoundingMode.HALF_UP);
        
        // Get tariff
        Tariff tariff = tariffRepository.findById(customer.getTariffId())
            .orElseThrow(() -> new RuntimeException("Tariff not found"));
        
        // Calculate charges
        BigDecimal energyCharge = calculateEnergyCharge(unitsConsumed, tariff.getTariffJson());
        BigDecimal fixedCharge = tariff.getFixedCharge();
        
        // Calculate tax
        BigDecimal taxPercent = getTaxPercent(tariff.getTariffJson());
        BigDecimal taxAmount = energyCharge.add(fixedCharge)
            .multiply(taxPercent)
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        
        BigDecimal totalAmount = energyCharge.add(fixedCharge).add(taxAmount);
        
        // Set due date (15 days from period end)
        LocalDate dueDate = request.getPeriodEnd().plusDays(15);
        
        Bill bill = new Bill();
        bill.setCustomerId(request.getCustomerId());
        bill.setPeriodStart(request.getPeriodStart());
        bill.setPeriodEnd(request.getPeriodEnd());
        bill.setUnitsConsumed(unitsConsumed);
        bill.setEnergyCharge(energyCharge);
        bill.setFixedCharge(fixedCharge);
        bill.setTaxAmount(taxAmount);
        bill.setOtherCharges(BigDecimal.ZERO);
        bill.setTotalAmount(totalAmount);
        bill.setDueDate(dueDate);
        bill.setStatus(Bill.BillStatus.GENERATED);
        
        return billRepository.save(bill);
    }
    
    private BigDecimal calculateEnergyCharge(BigDecimal units, String tariffJson) {
        try {
            JsonNode root = objectMapper.readTree(tariffJson);
            JsonNode slabs = root.get("slabs");
            
            if (slabs == null || !slabs.isArray()) {
                return BigDecimal.ZERO;
            }
            
            BigDecimal totalCharge = BigDecimal.ZERO;
            BigDecimal remainingUnits = units;
            BigDecimal previousLimit = BigDecimal.ZERO;
            
            for (JsonNode slab : slabs) {
                if (remainingUnits.compareTo(BigDecimal.ZERO) <= 0) break;
                
                BigDecimal rate = BigDecimal.valueOf(slab.get("rate").asDouble());
                JsonNode uptoNode = slab.get("upto");
                
                BigDecimal slabLimit = uptoNode == null ? 
                    BigDecimal.valueOf(Double.MAX_VALUE) : 
                    BigDecimal.valueOf(uptoNode.asDouble());
                
                BigDecimal slabUnits = remainingUnits.min(slabLimit.subtract(previousLimit));
                totalCharge = totalCharge.add(slabUnits.multiply(rate));
                remainingUnits = remainingUnits.subtract(slabUnits);
                
                if (uptoNode == null) break; // Last slab
                previousLimit = slabLimit;
            }
            
            return totalCharge.setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            throw new RuntimeException("Error calculating energy charge: " + e.getMessage());
        }
    }
    
    private BigDecimal getTaxPercent(String tariffJson) {
        try {
            JsonNode root = objectMapper.readTree(tariffJson);
            JsonNode taxNode = root.get("tax_percent");
            return taxNode != null ? 
                BigDecimal.valueOf(taxNode.asDouble()) : 
                BigDecimal.ZERO;
        } catch (Exception e) {
            return BigDecimal.ZERO;
        }
    }
}
