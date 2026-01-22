package com.electricitybilling.repository;

import com.electricitybilling.model.Meter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface MeterRepository extends JpaRepository<Meter, Integer> {
    Optional<Meter> findByMeterNo(String meterNo);
    List<Meter> findByCustomerId(Integer customerId);
    List<Meter> findByStatus(Meter.MeterStatus status);
}
