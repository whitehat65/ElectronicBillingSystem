package com.electricitybilling;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ElectricityBillingApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(ElectricityBillingApplication.class, args);
        System.out.println("\n===========================================");
        System.out.println("Electricity Billing System Started!");
        System.out.println("API: http://localhost:8080/api");
        System.out.println("Frontend: http://localhost:8080");
        System.out.println("===========================================\n");
    }
}
