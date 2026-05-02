package com.quintadalam.backend.application.mapper;

import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.domain.model.Payment;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.PaymentRepository;
import org.springframework.stereotype.Component;

/**
 * Mapper extendido: incluye datos de suite y último pago.
 * Inyecta PaymentRepository para lookup del pago más reciente.
 */
@Component
public class ReservationMapper {

    private final PaymentRepository paymentRepository;

    public ReservationMapper(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public ReservationResponse toResponse(Reservation reservation) {
        // Buscar el pago más reciente de esta reserva (puede ser null)
        Payment latestPayment = paymentRepository
            .findTopByReservationIdOrderByCreatedAtDesc(reservation.getId())
            .orElse(null);

        int nights = (int) java.time.temporal.ChronoUnit.DAYS.between(
            reservation.getCheckIn(),
            reservation.getCheckOut()
        );

        var room = reservation.getRoom();

        return new ReservationResponse(
            // Identidad
            reservation.getId(),
            reservation.getReservationCode(),
            reservation.getStatus(),
            reservation.getCreatedAt(),

            // Suite
            room.getId(),
            room.getCode(),
            room.getName(),
            room.getCategory(),
            room.getCapacity(),
            room.getBedType(),

            // Fechas
            reservation.getCheckIn(),
            reservation.getCheckOut(),
            nights,

            // Huésped
            reservation.getGuestsCount(),
            reservation.getGuestFullName(),
            reservation.getGuestEmail(),

            // Financiero
            reservation.getCurrency(),
            reservation.getNightlyRateAmount(),
            reservation.getSubtotalAmount(),
            reservation.getTaxesAmount(),
            reservation.getTotalAmount(),

            // Pago
            latestPayment != null ? latestPayment.getStatus()                   : null,
            latestPayment != null ? latestPayment.getStripeSessionId()          : null,
            latestPayment != null ? latestPayment.getStripePaymentIntentId()    : null,
            latestPayment != null ? latestPayment.getPaidAt()                   : null
        );
    }
}
