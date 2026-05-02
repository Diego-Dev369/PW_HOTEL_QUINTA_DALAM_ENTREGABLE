package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.StripeCheckoutRequest;
import com.quintadalam.backend.application.dto.response.PaymentSessionResponse;
import com.quintadalam.backend.application.mapper.PaymentMapper;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.config.StripeProperties;
import com.quintadalam.backend.domain.enums.PaymentStatus;
import com.quintadalam.backend.domain.model.Payment;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.PaymentRepository;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentService {

    private final ReservationService reservationService;
    private final PaymentRepository paymentRepository;
    private final PaymentMapper paymentMapper;
    private final StripeProperties stripeProperties;

    public PaymentService(
        ReservationService reservationService,
        PaymentRepository paymentRepository,
        PaymentMapper paymentMapper,
        StripeProperties stripeProperties
    ) {
        this.reservationService = reservationService;
        this.paymentRepository = paymentRepository;
        this.paymentMapper = paymentMapper;
        this.stripeProperties = stripeProperties;
    }

    @Transactional
    public PaymentSessionResponse createCheckoutSession(StripeCheckoutRequest request) throws Exception {
        if (!StringUtils.hasText(stripeProperties.secretKey())) {
            throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE, "STRIPE_NOT_CONFIGURED", "Stripe no está configurado en el servidor.");
        }

        Reservation reservation = reservationService.getReservationEntity(request.reservationId());

        if (reservation.getStatus() != com.quintadalam.backend.domain.enums.ReservationStatus.PENDING_PAYMENT) {
            throw new BusinessException(HttpStatus.CONFLICT, "RESERVATION_NOT_PAYABLE", "La reservación no está en estado pendiente de pago.");
        }

        String idempotencyKey = request.idempotencyKey() == null || request.idempotencyKey().isBlank()
            ? UUID.randomUUID().toString()
            : request.idempotencyKey();

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(request.successUrl())
            .setCancelUrl(request.cancelUrl())
            .setCustomerEmail(reservation.getGuestEmail())
            .putMetadata("reservation_id", reservation.getId().toString())
            .setPaymentIntentData(
                SessionCreateParams.PaymentIntentData.builder()
                    .putMetadata("reservation_id", reservation.getId().toString())
                    .build()
            )
            .addLineItem(buildLineItem(reservation))
            .build();

        RequestOptions requestOptions = RequestOptions.builder()
            .setIdempotencyKey(idempotencyKey)
            .build();

        Session session = Session.create(params, requestOptions);

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setStatus(PaymentStatus.CREATED);
        payment.setAmount(reservation.getTotalAmount());
        payment.setCurrency(reservation.getCurrency());
        payment.setStripeSessionId(session.getId());

        if (session.getPaymentIntent() != null) {
            payment.setStripePaymentIntentId(session.getPaymentIntent());
        }

        payment.setStatus(PaymentStatus.CREATED);

        paymentRepository.save(payment);

        System.out.println("PAYMENT CREATED SESSION: " + session.getId());
        payment.setStripePaymentIntentId(session.getPaymentIntent());
        paymentRepository.save(payment);

        return paymentMapper.toSessionResponse(session.getId(), session.getUrl());
    }

    @Transactional
public void markPaymentSucceeded(String paymentIntentId) {
    var paymentOpt = paymentRepository.findByStripePaymentIntentId(paymentIntentId);

    if (paymentOpt.isEmpty()) {
        System.out.println("PAYMENT NOT FOUND FOR PAYMENT INTENT: " + paymentIntentId);
        return;
    }

    Payment payment = paymentOpt.get();

    if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
        return;
    }

    payment.setStatus(PaymentStatus.SUCCEEDED);
    payment.setPaidAt(java.time.Instant.now());

    paymentRepository.save(payment);

    reservationService.confirmReservation(payment.getReservation().getId());

    System.out.println("PAYMENT SUCCESS VIA PAYMENT INTENT: " + paymentIntentId);
}
@Transactional
public void markCheckoutSessionCompleted(String stripeSessionId, String paymentIntentId) {

    var paymentOpt = paymentRepository.findByStripeSessionId(stripeSessionId);

    if (paymentOpt.isEmpty()) {
        System.out.println("PAYMENT NOT FOUND FOR SESSION: " + stripeSessionId);
        return;
    }

    Payment payment = paymentOpt.get();

    if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
        return;
    }

    System.out.println("CHECKOUT SESSION FOUND: " + stripeSessionId);
    System.out.println("PAYMENT INTENT RECEIVED: " + paymentIntentId);

    payment.setStripePaymentIntentId(paymentIntentId);
    payment.setStatus(PaymentStatus.SUCCEEDED);
    payment.setPaidAt(java.time.Instant.now());

    paymentRepository.save(payment);

    reservationService.confirmReservation(payment.getReservation().getId());

    System.out.println("PAYMENT SUCCESSFULLY CONFIRMED.");
}

    @Transactional
    public void markPaymentFailed(String paymentIntentId) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "PAYMENT_NOT_FOUND", "No se encontró pago para este payment_intent."));
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);
    }
    @Transactional
public void markReservationPaidByReservationId(String reservationId, String paymentIntentId) {

    Reservation reservation = reservationService.getReservationEntity(UUID.fromString(reservationId));

    Payment payment = paymentRepository.findTopByReservationIdOrderByCreatedAtDesc(reservation.getId())
        .orElseThrow(() -> new BusinessException(
            HttpStatus.NOT_FOUND,
            "PAYMENT_NOT_FOUND",
            "No se encontró el pago asociado."
        ));

    if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
        return;
    }

    payment.setStripePaymentIntentId(paymentIntentId);
    payment.setStatus(PaymentStatus.SUCCEEDED);
    payment.setPaidAt(java.time.Instant.now());

    paymentRepository.save(payment);

    reservationService.confirmReservation(reservation.getId());

    System.out.println("RESERVATION CONFIRMED FROM CHARGE EVENT: " + reservation.getReservationCode());
}
    private SessionCreateParams.LineItem buildLineItem(Reservation reservation) {
        BigDecimal cents = reservation.getTotalAmount().multiply(BigDecimal.valueOf(100));

        return SessionCreateParams.LineItem.builder()
            .setQuantity(1L)
            .setPriceData(
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency(reservation.getCurrency().toLowerCase())
                    .setUnitAmountDecimal(cents)
                    .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName("Reserva " + reservation.getReservationCode())
                            .putMetadata("room_id", reservation.getRoom().getId().toString())
                            .build()
                    )
                    .build()
            )
            .build();
    }
}
