package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.enums.ReservationStatus;
import com.quintadalam.backend.domain.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID>, JpaSpecificationExecutor<Reservation> {
    Optional<Reservation> findByIdAndDeletedAtIsNull(UUID id);
    Optional<Reservation> findByReservationCodeAndDeletedAtIsNull(String reservationCode);
    List<Reservation> findByGuestUserIdAndDeletedAtIsNullOrderByCheckInDesc(UUID guestUserId);

    @Query("""
        SELECT COUNT(r) FROM Reservation r
        WHERE r.deletedAt IS NULL
          AND r.checkIn <= :day AND r.checkOut > :day
          AND r.status IN :blocking
        """)
    long countBlockingOccupanciesOnDay(@Param("day") LocalDate day, @Param("blocking") List<ReservationStatus> blocking);

    @Query("""
        SELECT r FROM Reservation r WHERE r.deletedAt IS NULL
          AND r.checkIn = :day
          AND r.status IN :included
        """)
    List<Reservation> findArrivalsOn(@Param("day") LocalDate day, @Param("included") List<ReservationStatus> included);

    @Query("""
        SELECT r FROM Reservation r WHERE r.deletedAt IS NULL
          AND r.checkOut = :day
          AND r.status IN :included
        """)
    List<Reservation> findDeparturesOn(@Param("day") LocalDate day, @Param("included") List<ReservationStatus> included);

    Page<Reservation> findByDeletedAtIsNullOrderByCheckInDesc(Pageable pageable);

    @Query("SELECT COUNT(r) FROM Reservation r WHERE r.deletedAt IS NULL AND r.status NOT IN :excluded")
    long countOpenOperational(@Param("excluded") List<ReservationStatus> excluded);

    @Query("""
        SELECT r FROM Reservation r
        WHERE r.deletedAt IS NULL
          AND r.status <> :cancelledStatus
          AND r.checkOut >= :rangeStart
          AND r.checkIn <= :rangeEnd
        ORDER BY r.checkIn ASC
        """)
    List<Reservation> findActiveReservationsIntersecting(@Param("cancelledStatus") ReservationStatus cancelledStatus,
                                                      @Param("rangeStart") LocalDate rangeStart,
                                                      @Param("rangeEnd") LocalDate rangeEnd);
}

