package com.electricitybilling.repository;

import com.electricitybilling.model.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, Integer> {
    List<Reading> findByMeterIdOrderByReadingDateDesc(Integer meterId);
    
    Optional<Reading> findByMeterIdAndReadingDate(Integer meterId, LocalDate readingDate);
    
    @Query("SELECT r FROM Reading r WHERE r.meterId = ?1 AND r.readingDate <= ?2 ORDER BY r.readingDate DESC")
    List<Reading> findByMeterIdBeforeDate(Integer meterId, LocalDate date);
}
