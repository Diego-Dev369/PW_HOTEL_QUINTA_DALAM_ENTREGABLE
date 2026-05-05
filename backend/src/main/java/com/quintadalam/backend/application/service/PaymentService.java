package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.StripeCheckoutRequest;
import com.quintadalam.backend.application.dto.response.PaymentSessionResponse;
import com.quintadalam.backend.application.mapper.PaymentMapper;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.config.StripeProperties;
import com.quintadalam.backend.domain.enums.PaymentStatus;
import com.quintadalam.backend.domain.enums.ReservationStatus;
import com.quintadalam.backend.domain.model.Payment;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.repository.PaymentRepository;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

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
        // Validar configuración de Stripe
        String secretKey = stripeProperties.secretKey();
        if (!StringUtils.hasText(secretKey)) {
            log.error("Stripe secret key no configurada. Ver variable de entorno PAYMENT_STRIPE_SECRET_KEY");
            throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE,
                "STRIPE_NOT_CONFIGURED",
                "Stripe no está configurado en el servidor. Contacte al administrador.");
        }

        com.stripe.Stripe.apiKey = secretKey;
        
        // Validar que la reservación existe
        Reservation reservation = reservationService.getReservationEntity(request.reservationId());
        
        // Validar estado de la reservación
        ReservationStatus currentStatus = reservation.getStatus();
        if (currentStatus != ReservationStatus.PENDING_PAYMENT && currentStatus != ReservationStatus.PARTIALLY_PAID) {
            log.warn("Intento de pago para reservación en estado no pagable: reservationId={}, status={}", 
                request.reservationId(), currentStatus);
            throw new BusinessException(HttpStatus.CONFLICT, "RESERVATION_NOT_PAYABLE", 
                "La reservación no admite nuevo cobro Stripe en su estado actual (" + currentStatus + ").");
        }

        // Validar que el monto total sea válido para Stripe
        if (reservation.getTotalAmount() == null || reservation.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            log.error("Monto total inválido para Stripe: reservationId={}, totalAmount={}", 
                request.reservationId(), reservation.getTotalAmount());
            throw new BusinessException(HttpStatus.CONFLICT, "INVALID_PAYMENT_AMOUNT", 
                "El monto total de la reservación debe ser mayor a cero.");
        }

        // Generar idempotency key segura
        String idempotencyKey = StringUtils.hasText(request.idempotencyKey())
            ? request.idempotencyKey().trim()
            : UUID.randomUUID().toString();

        log.info("Iniciando checkout Stripe: reservationId={}, reservationCode={}, totalAmount={}, currency={}", 
            request.reservationId(), reservation.getReservationCode(), 
            reservation.getTotalAmount(), reservation.getCurrency());

        // Construir parámetros de sesión
        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(request.successUrl())
            .setCancelUrl(request.cancelUrl())
            .setCustomerEmail(reservation.getGuestEmail())
            .putMetadata("reservation_id", reservation.getId().toString())
            .putMetadata("reservation_code", reservation.getReservationCode())
            .setPaymentIntentData(
                SessionCreateParams.PaymentIntentData.builder()
                    .putMetadata("reservation_id", reservation.getId().toString())
                    .putMetadata("reservation_code", reservation.getReservationCode())
                    .build()
            )
            .addLineItem(buildLineItem(reservation))
            .build();

        RequestOptions requestOptions = RequestOptions.builder()
            .setIdempotencyKey(idempotencyKey)
            .build();

        // Crear sesión en Stripe
        Session session = Session.create(params, requestOptions);

        // Guardar registro de pago local
        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setStatus(PaymentStatus.CREATED);
        payment.setAmount(reservation.getTotalAmount());
        payment.setCurrency(reservation.getCurrency());
        payment.setStripeSessionId(session.getId());
        if (session.getPaymentIntent() != null) {
            payment.setStripePaymentIntentId(session.getPaymentIntent());
        }
        paymentRepository.save(payment);

        log.info("Checkout Stripe creado exitosamente: sessionId={}, paymentIntentId={}, reservationCode={}, amount={}", 
            session.getId(), session.getPaymentIntent(), reservation.getReservationCode(), reservation.getTotalAmount());

        return paymentMapper.toSessionResponse(session.getId(), session.getUrl());
    }

    @Transactional
    public void markPaymentFailed(String paymentIntentId) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "PAYMENT_NOT_FOUND", "No se encontró pago para este payment_intent."));
        payment.setStatus(PaymentStatus.FAILED);
        paymentRepository.save(payment);
    }

    private SessionCreateParams.LineItem buildLineItem(Reservation reservation) {
        BigDecimal cents = reservation.getTotalAmount().multiply(BigDecimal.valueOf(100));
        String cur = reservation.getCurrency() == null ? "mxn" : reservation.getCurrency().trim().toLowerCase();

        return SessionCreateParams.LineItem.builder()
            .setQuantity(1L)
            .setPriceData(
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency(cur)
                    .setUnitAmountDecimal(cents)
                    .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName("Estancia — " + reservation.getReservationCode() + " (IVA + ISH incl. en total)")
                            .putMetadata("room_id", reservation.getRoom().getId().toString())
                            .build()
                    )
                    .build()
            )
            .build();
    }
}
