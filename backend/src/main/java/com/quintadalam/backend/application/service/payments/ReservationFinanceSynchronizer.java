package com.quintadalam.backend.application.service.payments;

import com.quintadalam.backend.domain.enums.ReservationStatus;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.PaymentLedgerRepository;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class ReservationFinanceSynchronizer {

    private final PaymentLedgerRepository paymentLedgerRepository;

    public ReservationFinanceSynchronizer(PaymentLedgerRepository paymentLedgerRepository) {
        this.paymentLedgerRepository = paymentLedgerRepository;
    }

    public void synchronizeAfterLedgerChange(Reservation reservation) {
        if (reservation == null || reservation.getStatus() == null) {
            return;
        }

        ReservationStatus st = reservation.getStatus();
        if (st == ReservationStatus.CANCELLED || st == ReservationStatus.NO_SHOW || st == ReservationStatus.CHECKED_OUT) {
            return;
        }
        if (st == ReservationStatus.CHECKED_IN) {
            return;
        }

        BigDecimal ledgerNet = paymentLedgerRepository.sumAmountByReservationId(reservation.getId());
        if (ledgerNet == null) {
            ledgerNet = BigDecimal.ZERO;
        }

        BigDecimal total = reservation.getTotalAmount();

        if (ledgerNet.compareTo(BigDecimal.ZERO) <= 0) {
            reservation.setStatus(ReservationStatus.PENDING_PAYMENT);
        } else if (ledgerNet.compareTo(total) < 0) {
            reservation.setStatus(ReservationStatus.PARTIALLY_PAID);
        } else {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        }
    }
}
