package com.quintadalam.backend.application.dto.response;

import com.quintadalam.backend.domain.enums.PaymentStatus;
import com.quintadalam.backend.domain.enums.ReservationStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO de respuesta extendido para reservaciones.
 * Incluye snapshot de suite, desglose financiero y datos de pago.
 */
public record ReservationResponse(

    // ── Identidad de la reserva ──────────────────────────────
    UUID id,
    String reservationCode,
    ReservationStatus status,
    Instant createdAt,

    // ── Datos de la suite ────────────────────────────────────
    UUID roomId,
    String roomCode,        // Ej. "suite-patzcuaro"
    String roomName,        // Ej. "Suite Pátzcuaro"
    String roomCategory,    // Ej. "Suite Superior"
    Short  roomCapacity,
    String roomBedType,

    // ── Fechas y duración ────────────────────────────────────
    LocalDate checkIn,
    LocalDate checkOut,
    int nights,             // check_out - check_in

    // ── Huésped ──────────────────────────────────────────────
    short guestsCount,
    String guestFullName,
    String guestEmail,

    // ── Desglose financiero ──────────────────────────────────
    String currency,
    BigDecimal nightlyRateAmount,
    BigDecimal subtotalAmount,
    BigDecimal taxesAmount,
    BigDecimal totalAmount,

    // ── Datos de pago (null si aún no se pagó) ───────────────
    PaymentStatus paymentStatus,       // CREATED, SUCCEEDED, FAILED…
    String stripeSessionId,
    String stripePaymentIntentId,
    Instant paidAt
) {}
