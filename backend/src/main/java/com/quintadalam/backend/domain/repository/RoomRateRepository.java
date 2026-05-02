package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.RoomRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface RoomRateRepository extends JpaRepository<RoomRate, UUID> {

    interface RateSnapshot {
        BigDecimal getNightlyRateAmount();
        String getCurrency();
    }

    @Query(value = """
        SELECT rr.nightly_rate_amount AS nightlyRateAmount, rr.currency
        FROM hotel.room_rates rr
        WHERE rr.room_id = :roomId
          AND rr.deleted_at IS NULL
          AND rr.valid_during @> CAST(:checkIn AS date)
        ORDER BY lower(rr.valid_during) DESC, rr.created_at DESC
        LIMIT 1
        """, nativeQuery = true)
    Optional<RateSnapshot> findRateForDate(@Param("roomId") UUID roomId, @Param("checkIn") LocalDate checkIn);
}
