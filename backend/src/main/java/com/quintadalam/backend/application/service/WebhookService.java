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

import java.util.Map;

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
            case "payment_intent.succeeded" -> processPaymentIntentSucceeded(event);
            case "payment_intent.payment_failed" -> processPaymentIntentFailed(event);
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
        PaymentIntent paymentIntent = extractPaymentIntent(event);
        paymentService.markPaymentSucceeded(paymentIntent.getId());
    }

    private void processPaymentIntentFailed(Event event) {
        PaymentIntent paymentIntent = extractPaymentIntent(event);
        paymentService.markPaymentFailed(paymentIntent.getId());
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
}
