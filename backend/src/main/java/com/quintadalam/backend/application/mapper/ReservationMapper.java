package com.quintadalam.backend.application.mapper;

import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.domain.model.Payment;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.PaymentLedgerRepository;
import com.quintadalam.backend.domain.repository.PaymentRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class ReservationMapper {

    private final PaymentRepository paymentRepository;
    private final PaymentLedgerRepository paymentLedgerRepository;

    public ReservationMapper(PaymentRepository paymentRepository, PaymentLedgerRepository paymentLedgerRepository) {
        this.paymentRepository = paymentRepository;
        this.paymentLedgerRepository = paymentLedgerRepository;
    }

    public ReservationResponse toResponse(Reservation reservation) {
        Payment latestPayment = paymentRepository
            .findTopByReservationIdOrderByCreatedAtDesc(reservation.getId())
            .orElse(null);

        int nights = (int) java.time.temporal.ChronoUnit.DAYS.between(
            reservation.getCheckIn(),
            reservation.getCheckOut()
        );

        var room = reservation.getRoom();

        BigDecimal ledgerNet = paymentLedgerRepository.sumAmountByReservationId(reservation.getId());
        if (ledgerNet == null) {
            ledgerNet = BigDecimal.ZERO;
        }
        ledgerNet = ledgerNet.setScale(2, RoundingMode.HALF_EVEN);

        BigDecimal balanceDue = reservation.getTotalAmount().subtract(ledgerNet).setScale(2, RoundingMode.HALF_EVEN);

        return new ReservationResponse(
            reservation.getId(),
            reservation.getReservationCode(),
            reservation.getStatus(),
            reservation.getCreatedAt(),
            room.getId(),
            room.getCode(),
            room.getName(),
            room.getCategory(),
            room.getCapacity(),
            room.getBedType(),
            reservation.getCheckIn(),
            reservation.getCheckOut(),
            nights,
            reservation.getGuestsCount(),
            reservation.getGuestFullName(),
            reservation.getGuestEmail(),
            reservation.getCurrency(),
            reservation.getNightlyRateAmount(),
            reservation.getRoomBaseAmount(),
            reservation.getIvaAmount(),
            reservation.getIshAmount(),
            reservation.getSubtotalAmount(),
            reservation.getTaxesAmount(),
            reservation.getTotalAmount(),
            ledgerNet,
            balanceDue,
            latestPayment != null ? latestPayment.getStatus() : null,
            latestPayment != null ? latestPayment.getStripeSessionId() : null,
            latestPayment != null ? latestPayment.getStripePaymentIntentId() : null,
            latestPayment != null ? latestPayment.getPaidAt() : null
        );
    }
}
