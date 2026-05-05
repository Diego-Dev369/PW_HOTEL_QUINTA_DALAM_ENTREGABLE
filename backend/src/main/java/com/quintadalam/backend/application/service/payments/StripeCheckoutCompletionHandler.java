package com.quintadalam.backend.application.service.payments;

import com.quintadalam.backend.application.service.NotificationOutboxService;
import com.quintadalam.backend.domain.enums.LedgerPaymentMethod;
import com.quintadalam.backend.domain.enums.PaymentStatus;
import com.quintadalam.backend.domain.model.Payment;
import com.quintadalam.backend.domain.model.PaymentLedgerEntry;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.PaymentLedgerRepository;
import com.quintadalam.backend.domain.repository.PaymentRepository;
import com.quintadalam.backend.domain.repository.ReservationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;

@Service
public class StripeCheckoutCompletionHandler {

    private static final Logger log = LoggerFactory.getLogger(StripeCheckoutCompletionHandler.class);

    private final PaymentRepository paymentRepository;
    private final PaymentLedgerRepository ledgerRepository;
    private final ReservationRepository reservationRepository;
    private final ReservationFinanceSynchronizer financeSynchronizer;
    private final NotificationOutboxService notificationOutboxService;

    public StripeCheckoutCompletionHandler(
        PaymentRepository paymentRepository,
        PaymentLedgerRepository ledgerRepository,
        ReservationRepository reservationRepository,
        ReservationFinanceSynchronizer financeSynchronizer,
        NotificationOutboxService notificationOutboxService
    ) {
        this.paymentRepository = paymentRepository;
        this.ledgerRepository = ledgerRepository;
        this.reservationRepository = reservationRepository;
        this.financeSynchronizer = financeSynchronizer;
        this.notificationOutboxService = notificationOutboxService;
    }

    @Transactional
    public void finalizeFromCheckoutSession(
        String stripeCheckoutSessionId,
        String stripePaymentIntentId,
        BigDecimal stripeTotalMajorUnits,
        String stripeCurrencyUpperOrNull
    ) {
        Payment payment = paymentRepository.findByStripeSessionId(stripeCheckoutSessionId).orElse(null);
        if (payment == null) {
            log.warn("Checkout Stripe sin Payment local para session {}", stripeCheckoutSessionId);
            return;
        }

        if (stripeTotalMajorUnits == null || stripeTotalMajorUnits.signum() <= 0) {
            stripeTotalMajorUnits = payment.getAmount().setScale(2, RoundingMode.HALF_EVEN);
        }

        Reservation reservation = payment.getReservation();

        String currency = normalizeCurrency(stripeCurrencyUpperOrNull, payment.getCurrency());

        if (payment.getStatus() != PaymentStatus.SUCCEEDED) {
            payment.setStripePaymentIntentId(stripePaymentIntentId);
            payment.setStatus(PaymentStatus.SUCCEEDED);
            payment.setPaidAt(Instant.now());
            paymentRepository.save(payment);
        }

        reconcileStripeLedger(reservation, payment, stripePaymentIntentId, stripeCheckoutSessionId, stripeTotalMajorUnits, currency);
        financeSynchronizer.synchronizeAfterLedgerChange(reservation);
        reservationRepository.save(reservation);
        notificationOutboxService.enqueueBookingConfirmed(reservation.getId(), java.util.Map.of());

        log.info("Stripe Checkout finalizado reservation={} session={}", reservation.getReservationCode(), stripeCheckoutSessionId);
    }

    private String normalizeCurrency(String stripeCurrencyUpperOrNull, String paymentFallback) {
        if (StringUtils.hasText(stripeCurrencyUpperOrNull)) {
            String c = stripeCurrencyUpperOrNull.trim();
            return c.substring(0, Math.min(c.length(), 3)).toUpperCase();
        }
        if (StringUtils.hasText(paymentFallback)) {
            return paymentFallback.trim().substring(0, Math.min(paymentFallback.trim().length(), 3)).toUpperCase();
        }
        return "MXN";
    }

    private void reconcileStripeLedger(
        Reservation reservation,
        Payment payment,
        String paymentIntentId,
        String checkoutSessionId,
        BigDecimal amountMajor,
        String currency
    ) {
        boolean exists = ledgerRepository.findByReservation_IdOrderByCreatedAtDesc(reservation.getId()).stream()
            .anyMatch(l ->
                LedgerPaymentMethod.STRIPE_CARD == l.getMethod()
                    && checkoutSessionId.equals(l.getStripeCheckoutSessionId())
            );

        if (exists) {
            return;
        }

        PaymentLedgerEntry entry = new PaymentLedgerEntry();
        entry.setReservation(reservation);
        entry.setMethod(LedgerPaymentMethod.STRIPE_CARD);
        entry.setAmount(amountMajor.setScale(2, RoundingMode.HALF_EVEN));
        entry.setCurrency(currency);
        entry.setStripePaymentIntentId(paymentIntentId);
        entry.setStripeCheckoutSessionId(checkoutSessionId);
        entry.setNote("Stripe Checkout Session");
        ledgerRepository.save(entry);
    }
}
