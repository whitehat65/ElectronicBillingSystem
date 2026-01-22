package com.electricitybilling.config;

import com.electricitybilling.model.User;
import com.electricitybilling.model.Tariff;
import com.electricitybilling.model.Customer;
import com.electricitybilling.model.Meter;
import com.electricitybilling.model.Reading;
import com.electricitybilling.model.Payment;
import com.electricitybilling.repository.UserRepository;
import com.electricitybilling.repository.TariffRepository;
import com.electricitybilling.repository.CustomerRepository;
import com.electricitybilling.repository.MeterRepository;
import com.electricitybilling.repository.ReadingRepository;
import com.electricitybilling.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.boot.CommandLineRunner;

import java.math.BigDecimal;
import java.time.LocalDate;

@Component
@Profile("local")
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TariffRepository tariffRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private MeterRepository meterRepository;

    @Autowired
    private ReadingRepository readingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User();
                admin.setUsername("admin");
                admin.setFullName("System Administrator");
                admin.setEmail("admin@electricitybilling.com");
                admin.setRole(User.UserRole.ADMIN);
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                userRepository.save(admin);
                System.out.println("[DataInitializer] Created local admin user: admin / admin123");
            } else {
                System.out.println("[DataInitializer] Admin user already exists");
            }

            // Create sample tariffs if none exist
            if (tariffRepository.count() == 0) {
                Tariff domestic = new Tariff();
                domestic.setName("Domestic");
                domestic.setDescription("Residential slabs sample");
                domestic.setTariffJson("{\"slabs\":[{\"upto\":100,\"rate\":2.5},{\"upto\":300,\"rate\":4.0},{\"upto\":null,\"rate\":6.0}],\"tax_percent\":5}");
                domestic.setFixedCharge(BigDecimal.valueOf(50.00));
                tariffRepository.save(domestic);

                Tariff commercial = new Tariff();
                commercial.setName("Commercial");
                commercial.setDescription("Commercial tariff sample");
                commercial.setTariffJson("{\"slabs\":[{\"upto\":200,\"rate\":5.0},{\"upto\":500,\"rate\":7.0},{\"upto\":null,\"rate\":10.0}],\"tax_percent\":12}");
                commercial.setFixedCharge(BigDecimal.valueOf(150.00));
                tariffRepository.save(commercial);

                System.out.println("[DataInitializer] Created sample tariffs");
            } else {
                System.out.println("[DataInitializer] Tariffs already present: " + tariffRepository.count());
            }

            // Create sample customers if none exist
            if (customerRepository.count() == 0) {
                Tariff t = tariffRepository.findAll().stream().findFirst().orElse(null);
                if (t != null) {
                    Customer c1 = new Customer();
                    c1.setName("Rajesh Kumar");
                    c1.setAddress("123 MG Road");
                    c1.setConnectionNo("CONN-2024-001");
                    c1.setTariffId(t.getTariffId());
                    c1.setContactPhone("+91-9876543210");
                    c1.setContactEmail("rajesh.kumar@example.com");
                    customerRepository.save(c1);

                    Customer c2 = new Customer();
                    c2.setName("Priya Sharma");
                    c2.setAddress("456 Park Street");
                    c2.setConnectionNo("CONN-2024-002");
                    c2.setTariffId(t.getTariffId());
                    c2.setContactPhone("+91-9876543211");
                    c2.setContactEmail("priya.sharma@example.com");
                    customerRepository.save(c2);

                    System.out.println("[DataInitializer] Created sample customers");
                }
            } else {
                System.out.println("[DataInitializer] Customers already present: " + customerRepository.count());
            }

            // Seed meters, readings and payments for each customer if missing
            int createdMeters = 0;
            int createdReadings = 0;
            int createdPayments = 0;
            for (Customer c : customerRepository.findAll()) {
                try {
                    boolean hasMeter = !meterRepository.findByCustomerId(c.getCustomerId()).isEmpty();
                    if (!hasMeter) {
                        Meter m = new Meter();
                        m.setCustomerId(c.getCustomerId());
                        m.setMeterNo("MTR-" + (1000 + c.getCustomerId()));
                        m.setInstallDate(LocalDate.now().minusMonths(6));
                        m.setMeterType("Single Phase");
                        meterRepository.save(m);
                        createdMeters++;

                        // Add a reading
                        Reading r = new Reading();
                        r.setMeterId(m.getMeterId());
                        r.setReadingDate(LocalDate.now().minusDays(1));
                        r.setReadingValue(BigDecimal.valueOf(123.450));
                        readingRepository.save(r);
                        createdReadings++;

                        // Add a sample payment (no bill association yet)
                        Payment p = new Payment();
                        p.setCustomerId(c.getCustomerId());
                        p.setPaymentDate(LocalDate.now());
                        p.setAmount(BigDecimal.valueOf(500.00));
                        p.setReference("INITIAL_PAYMENT");
                        paymentRepository.save(p);
                        createdPayments++;

                        System.out.println("[DataInitializer] Created meter/reading/payment for customer: " + c.getName());
                    } else {
                        System.out.println("[DataInitializer] Customer already has meter(s): " + c.getCustomerId());
                    }
                } catch (Exception ex) {
                    System.err.println("[DataInitializer] Failed seeding meter/reading/payment for customer " + c.getCustomerId() + ": " + ex.getMessage());
                }
            }

            System.out.println("[DataInitializer] Meters created=" + createdMeters + ", readings created=" + createdReadings + ", payments created=" + createdPayments);

        } catch (Exception e) {
            System.err.println("[DataInitializer] Failed to initialize data: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
