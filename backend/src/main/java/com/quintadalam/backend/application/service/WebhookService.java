package com.quintadalam.backend.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.config.StripeProperties;
import com.quintadalam.backend.domain.model.ProcessedEvent;
import com.quintadalam.backend.domain.repository.ProcessedEventRepository;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.stripe.model.checkout.Session;
import java.util.Map;
import com.stripe.model.Charge;

@Service
public class WebhookService {

    private final StripeProperties stripeProperties;
    private final ProcessedEventRepository processedEventRepository;
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    public WebhookService(
        StripeProperties stripeProperties,
        ProcessedEventRepository processedEventRepository,
        PaymentService paymentService,
        ObjectMapper objectMapper
    ) {
        this.stripeProperties = stripeProperties;
        this.processedEventRepository = processedEventRepository;
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public void handleStripeEvent(String payload, String stripeSignature) throws Exception {
        if (!StringUtils.hasText(stripeProperties.webhookSecret())) {
            throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE, "STRIPE_WEBHOOK_NOT_CONFIGURED", "Webhook de Stripe no configurado.");
        }

        Event event = Webhook.constructEvent(payload, stripeSignature, stripeProperties.webhookSecret());

        if (processedEventRepository.findByProviderAndEventId("STRIPE", event.getId()).isPresent()) {
            return;
        }

        switch (event.getType()) {
    case "checkout.session.completed" -> processCheckoutSessionCompleted(event);
    case "payment_intent.succeeded" -> processPaymentIntentSucceeded(event);
    case "payment_intent.payment_failed" -> processPaymentIntentFailed(event);
    case "charge.succeeded" -> processChargeSucceeded(event);
    default -> {
    }
}

        ProcessedEvent processedEvent = new ProcessedEvent();
        processedEvent.setProvider("STRIPE");
        processedEvent.setEventId(event.getId());
        processedEvent.setEventType(event.getType());
        processedEvent.setPayload(parsePayload(payload));
        processedEventRepository.save(processedEvent);
    }

    private void processPaymentIntentSucceeded(Event event) {
    try {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().deserializeUnsafe();

        System.out.println("PAYMENT INTENT SUCCEEDED: " + paymentIntent.getId());

        if (paymentIntent.getId() == null) {
            return;
        }

        paymentService.markPaymentSucceeded(paymentIntent.getId());

    } catch (Exception ex) {
        throw new BusinessException(
            HttpStatus.BAD_REQUEST,
            "INVALID_WEBHOOK_EVENT",
            "Error procesando payment_intent.succeeded"
        );
    }
}

    private void processPaymentIntentFailed(Event event) {
    try {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().deserializeUnsafe();

        if (paymentIntent.getId() == null) {
            return;
        }

        paymentService.markPaymentFailed(paymentIntent.getId());

    } catch (Exception ex) {
        throw new BusinessException(
            HttpStatus.BAD_REQUEST,
            "INVALID_WEBHOOK_EVENT",
            "Error procesando payment_intent.payment_failed"
        );
    }
}

    private PaymentIntent extractPaymentIntent(Event event) {
        EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();
        return (PaymentIntent) deserializer.getObject().orElseThrow(
            () -> new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_WEBHOOK_EVENT", "No fue posible deserializar el evento de Stripe.")
        );
    }

    private Map<String, Object> parsePayload(String payload) {
        try {
            return objectMapper.readValue(payload, new TypeReference<>() {
            });
        } catch (Exception ex) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_WEBHOOK_PAYLOAD", "Payload inválido en webhook.");
        }
    }
    private void processCheckoutSessionCompleted(Event event) {
    try {
        Session session = (Session) event.getDataObjectDeserializer().deserializeUnsafe();

        System.out.println("WEBHOOK SESSION ID: " + session.getId());
        System.out.println("WEBHOOK PAYMENT INTENT: " + session.getPaymentIntent());

        if (session.getId() == null) {
            return;
        }

        String paymentIntentId = session.getPaymentIntent();

        if (paymentIntentId == null) {
            System.out.println("CHECKOUT SESSION WITHOUT PAYMENT INTENT.");
            return;
        }

        paymentService.markCheckoutSessionCompleted(
            session.getId(),
            paymentIntentId
        );

    } catch (Exception ex) {
        throw new BusinessException(
            HttpStatus.BAD_REQUEST,
            "INVALID_WEBHOOK_EVENT",
            "Error procesando checkout.session.completed"
        );
    }
}
private void processChargeSucceeded(Event event) {
    try {
        Charge charge = (Charge) event.getDataObjectDeserializer().deserializeUnsafe();

        System.out.println("CHARGE SUCCEEDED: " + charge.getId());

        String reservationId = charge.getMetadata() != null
            ? charge.getMetadata().get("reservation_id")
            : null;

        String paymentIntentId = charge.getPaymentIntent();

        System.out.println("RESERVATION ID FROM CHARGE: " + reservationId);
        System.out.println("PAYMENT INTENT FROM CHARGE: " + paymentIntentId);

        if (reservationId == null || paymentIntentId == null) {
            System.out.println("CHARGE WITHOUT REQUIRED METADATA.");
            return;
        }

        paymentService.markReservationPaidByReservationId(
            reservationId,
            paymentIntentId
        );

    } catch (Exception ex) {
        throw new BusinessException(
            HttpStatus.BAD_REQUEST,
            "INVALID_WEBHOOK_EVENT",
            "Error procesando charge.succeeded"
        );
    }
}

}
