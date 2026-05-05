package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.NotificationOutboxEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface NotificationOutboxRepository extends JpaRepository<NotificationOutboxEntry, UUID> {

    @Query(value = """
        SELECT *
        FROM hotel.notifications_outbox o
        WHERE o.status IN ('PENDING', 'FAILED')
          AND (o.next_attempt_at IS NULL OR o.next_attempt_at <= :now)
        ORDER BY o.created_at
        FOR UPDATE SKIP LOCKED
        LIMIT :batchSize
        """, nativeQuery = true)
    List<NotificationOutboxEntry> lockDueBatch(@Param("now") Instant now, @Param("batchSize") int batchSize);
}
