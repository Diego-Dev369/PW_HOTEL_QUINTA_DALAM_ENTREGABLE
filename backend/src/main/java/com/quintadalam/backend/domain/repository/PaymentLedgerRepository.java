package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.enums.LedgerPaymentMethod;
import com.quintadalam.backend.domain.model.PaymentLedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PaymentLedgerRepository extends JpaRepository<PaymentLedgerEntry, UUID> {

    @Query("SELECT COALESCE(SUM(l.amount), 0) FROM PaymentLedgerEntry l WHERE l.reservation.id = :reservationId")
    BigDecimal sumAmountByReservationId(@Param("reservationId") UUID reservationId);

    List<PaymentLedgerEntry> findByReservation_IdOrderByCreatedAtDesc(UUID reservationId);

    @Query("SELECT COALESCE(SUM(l.amount), 0) FROM PaymentLedgerEntry l WHERE l.reservation.id = :rid AND l.method <> :exclude")
    BigDecimal netPaidExcludingComplimentary(@Param("rid") UUID rid, @Param("exclude") LedgerPaymentMethod complimentary);
}
