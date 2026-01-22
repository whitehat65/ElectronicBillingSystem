package com.electricitybilling.repository;

import com.electricitybilling.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByBillId(Integer billId);
    List<Payment> findByCustomerId(Integer customerId);
}
