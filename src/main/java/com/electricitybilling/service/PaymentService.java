package com.electricitybilling.service;

import com.electricitybilling.model.Payment;
import com.electricitybilling.model.Bill;
import com.electricitybilling.repository.PaymentRepository;
import com.electricitybilling.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private BillRepository billRepository;
    
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
    
    public Optional<Payment> getPaymentById(Integer id) {
        return paymentRepository.findById(id);
    }
    
    public List<Payment> getPaymentsByBillId(Integer billId) {
        return paymentRepository.findByBillId(billId);
    }
    
    public Payment createPayment(Payment payment) {
        Payment savedPayment = paymentRepository.save(payment);
        
        // Update bill status if bill_id is provided
        if (payment.getBillId() != null) {
            updateBillStatus(payment.getBillId());
        }
        
        return savedPayment;
    }
    
    private void updateBillStatus(Integer billId) {
        Bill bill = billRepository.findById(billId)
            .orElseThrow(() -> new RuntimeException("Bill not found"));
        
        List<Payment> payments = paymentRepository.findByBillId(billId);
        BigDecimal totalPaid = payments.stream()
            .map(Payment::getAmount)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (totalPaid.compareTo(bill.getTotalAmount()) >= 0) {
            bill.setStatus(Bill.BillStatus.PAID);
        } else if (totalPaid.compareTo(BigDecimal.ZERO) > 0) {
            bill.setStatus(Bill.BillStatus.PARTIALLY_PAID);
        }
        
        billRepository.save(bill);
    }
}
