package com.quintadalam.backend.application.dto.response;

import com.quintadalam.backend.domain.enums.ReservationStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ReservationResponse(
    UUID id,
    String reservationCode,
    UUID roomId,
    ReservationStatus status,
    LocalDate checkIn,
    LocalDate checkOut,
    short guestsCount,
    String guestFullName,
    String guestEmail,
    BigDecimal nightlyRateAmount,
    BigDecimal subtotalAmount,
    BigDecimal taxesAmount,
    BigDecimal totalAmount,
    String currency
) {
}
