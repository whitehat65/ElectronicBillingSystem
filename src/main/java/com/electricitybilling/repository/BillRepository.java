package com.electricitybilling.repository;

import com.electricitybilling.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Integer> {
    List<Bill> findByCustomerIdOrderByPeriodEndDesc(Integer customerId);
    List<Bill> findByStatus(Bill.BillStatus status);
    List<Bill> findByCustomerIdAndStatus(Integer customerId, Bill.BillStatus status);
}
