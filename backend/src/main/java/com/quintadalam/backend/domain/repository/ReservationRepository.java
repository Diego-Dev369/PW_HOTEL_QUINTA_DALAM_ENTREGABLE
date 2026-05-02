package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {
    Optional<Reservation> findByIdAndDeletedAtIsNull(UUID id);
    Optional<Reservation> findByReservationCodeAndDeletedAtIsNull(String reservationCode);
    List<Reservation> findByGuestUserIdAndDeletedAtIsNullOrderByCheckInDesc(UUID guestUserId);
}
