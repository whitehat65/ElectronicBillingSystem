package com.electricitybilling.service;

import com.electricitybilling.model.Customer;
import com.electricitybilling.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }
    
    public Optional<Customer> getCustomerById(Integer id) {
        return customerRepository.findById(id);
    }
    
    public Customer createCustomer(Customer customer) {
        // Generate unique customer code
        String customerCode = "CUST" + System.currentTimeMillis();
        customer.setCustomerCode(customerCode);
        customer.setStatus(Customer.CustomerStatus.ACTIVE);
        return customerRepository.save(customer);
    }
    
    public Customer updateCustomer(Integer id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        if (customerDetails.getName() != null) customer.setName(customerDetails.getName());
        if (customerDetails.getAddress() != null) customer.setAddress(customerDetails.getAddress());
        if (customerDetails.getConnectionNo() != null) customer.setConnectionNo(customerDetails.getConnectionNo());
        if (customerDetails.getTariffId() != null) customer.setTariffId(customerDetails.getTariffId());
        if (customerDetails.getContactPhone() != null) customer.setContactPhone(customerDetails.getContactPhone());
        if (customerDetails.getContactEmail() != null) customer.setContactEmail(customerDetails.getContactEmail());
        if (customerDetails.getStatus() != null) customer.setStatus(customerDetails.getStatus());
        
        return customerRepository.save(customer);
    }
    
    public void deleteCustomer(Integer id) {
        customerRepository.deleteById(id);
    }
}
