package com.electricitybilling.repository;

import com.electricitybilling.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Optional<Customer> findByCustomerCode(String customerCode);
    List<Customer> findByStatus(Customer.CustomerStatus status);
    List<Customer> findByTariffId(Integer tariffId);
}
