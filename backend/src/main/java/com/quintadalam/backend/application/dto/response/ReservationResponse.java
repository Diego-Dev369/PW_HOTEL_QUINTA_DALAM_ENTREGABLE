package com.quintadalam.backend.application.dto.response;

import com.quintadalam.backend.domain.enums.PaymentStatus;
import com.quintadalam.backend.domain.enums.ReservationStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ReservationResponse(

    UUID id,
    String reservationCode,
    ReservationStatus status,
    Instant createdAt,

    UUID roomId,
    String roomCode,
    String roomName,
    String roomCategory,
    Short roomCapacity,
    String roomBedType,

    LocalDate checkIn,
    LocalDate checkOut,
    int nights,

    short guestsCount,
    String guestFullName,
    String guestEmail,

    String currency,
    BigDecimal nightlyRateAmount,

    BigDecimal roomBaseAmount,
    BigDecimal ivaAmount,
    BigDecimal ishAmount,

    BigDecimal subtotalAmount,
    BigDecimal taxesAmount,
    BigDecimal totalAmount,

    BigDecimal ledgerNetPaid,
    BigDecimal balanceDue,

    PaymentStatus paymentStatus,
    String stripeSessionId,
    String stripePaymentIntentId,
    Instant paidAt
) {
}
