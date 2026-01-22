package com.electricitybilling.repository;

import com.electricitybilling.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Integer> {
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
