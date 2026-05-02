package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.Room;
import com.quintadalam.backend.domain.projection.RoomAvailabilityProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RoomRepository extends JpaRepository<Room, UUID> {

    Optional<Room> findByIdAndStatus(UUID id, com.quintadalam.backend.domain.enums.RoomStatus status);

    @Query(value = """
    SELECT
      r.id AS id,
      r.code AS code,
      r.name AS name,
      r.subtitle AS subtitle,
      r.category AS category,
      r.capacity AS capacity,
      rr.nightly_rate_amount AS "nightlyRateAmount",
      rr.currency AS currency
    FROM hotel.rooms r
    JOIN hotel.room_rates rr
      ON rr.room_id = r.id
    WHERE r.status = CAST('ACTIVE' AS hotel.room_status)
      AND r.deleted_at IS NULL
      AND rr.deleted_at IS NULL
      AND (:guests IS NULL OR r.capacity >= CAST(:guests AS smallint))
      AND rr.valid_during && daterange(CAST(:checkIn AS date), CAST(:checkOut AS date), '[)')
      AND CAST(:checkOut AS date) > CAST(:checkIn AS date)
      AND NOT EXISTS (
        SELECT 1
        FROM hotel.reservations res
        WHERE res.room_id = r.id
          AND res.status IN ('PENDING_PAYMENT', 'CONFIRMED', 'CHECKED_IN')
          AND res.deleted_at IS NULL
          AND daterange(res.check_in, res.check_out, '[)')
              && daterange(CAST(:checkIn AS date), CAST(:checkOut AS date), '[)')
      )
    ORDER BY r.capacity, r.name
    """, nativeQuery = true)
    List<RoomAvailabilityProjection> findAvailableRooms(
        @Param("checkIn") LocalDate checkIn,
        @Param("checkOut") LocalDate checkOut,
        @Param("guests") Short guests
    );
}
