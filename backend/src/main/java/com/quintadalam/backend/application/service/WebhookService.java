package com.quintadalam.backend.application.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quintadalam.backend.application.service.payments.StripeCheckoutCompletionHandler;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.config.StripeProperties;
import com.quintadalam.backend.domain.model.ProcessedEvent;
import com.quintadalam.backend.domain.repository.ProcessedEventRepository;
import com.stripe.exception.EventDataObjectDeserializationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class WebhookService {

    private static final Logger log = LoggerFactory.getLogger(WebhookService.class);

    private final StripeProperties stripeProperties;
    private final ProcessedEventRepository processedEventRepository;
    private final StripeCheckoutCompletionHandler stripeCheckoutCompletionHandler;
    private final PaymentService paymentService;
    private final ObjectMapper objectMapper;

    public WebhookService(
        StripeProperties stripeProperties,
        ProcessedEventRepository processedEventRepository,
        StripeCheckoutCompletionHandler stripeCheckoutCompletionHandler,
        PaymentService paymentService,
        ObjectMapper objectMapper
    ) {
        this.stripeProperties = stripeProperties;
        this.processedEventRepository = processedEventRepository;
        this.stripeCheckoutCompletionHandler = stripeCheckoutCompletionHandler;
        this.paymentService = paymentService;
        this.objectMapper = objectMapper;
    }

    /**
     * Flujo Stripe unificado para confirmación económica: únicamente {@code checkout.session.completed}.
     * Los demás eventos sólo llevan efectos complementarios/fallos sin duplicar la confirmación.
     */
    @Transactional
    public void handleStripeEvent(String payload, String stripeSignature) throws Exception {
        if (!StringUtils.hasText(stripeProperties.webhookSecret())) {
            throw new BusinessException(HttpStatus.SERVICE_UNAVAILABLE, "STRIPE_WEBHOOK_NOT_CONFIGURED", "Webhook de Stripe no configurado.");
        }

        Event event = Webhook.constructEvent(payload, stripeSignature, stripeProperties.webhookSecret());

        ProcessedEvent marker = processedEventRepository.findByProviderAndEventId("STRIPE", event.getId()).orElse(null);
        if (marker != null && marker.isCompleted()) {
            log.debug("Evento Stripe duplicado omitido {}", event.getId());
            return;
        }

        if (marker == null) {
            ProcessedEvent inserted = baseMarker(event.getId(), event.getType());
            try {
                processedEventRepository.saveAndFlush(inserted);
                marker = inserted;
            } catch (DataIntegrityViolationException concurrency) {
                marker = processedEventRepository.findByProviderAndEventId("STRIPE", event.getId())
                    .orElseThrow(() -> concurrency);
            }
        }

        if (marker.isCompleted()) {
            return;
        }

        try {
            switch (event.getType()) {
                case "checkout.session.completed" -> finalizeCheckoutSafe(event);
                case "payment_intent.payment_failed" -> failPaymentSafe(event);
                case "payment_intent.succeeded" -> log.trace("Stripe payment_intent.succeeded omitido como confirmador canónico");
                default -> log.trace("Stripe event ignorado tipo={}", event.getType());
            }
            marker.setPayload(parsePayload(payload));
            marker.setCompleted(true);
            processedEventRepository.save(marker);
        } catch (RuntimeException ex) {
            log.error("Stripe webhook falló antes de cerrar marca eventId={}: {}", event.getId(), ex.getMessage());
            throw ex;
        }
    }

    private ProcessedEvent baseMarker(String eventId, String type) {
        ProcessedEvent p = new ProcessedEvent();
        p.setProvider("STRIPE");
        p.setEventId(eventId);
        p.setEventType(type == null ? "UNKNOWN" : type);
        p.setCompleted(false);
        return p;
    }

    private void finalizeCheckoutSafe(Event event) throws EventDataObjectDeserializationException {
        Session session = (Session) event.getDataObjectDeserializer().deserializeUnsafe();
        String sessionId = session.getId();
        String pi = session.getPaymentIntent();

        BigDecimal gross;
        Long amountTotal = session.getAmountTotal();
        if (amountTotal != null) {
            gross = BigDecimal.valueOf(amountTotal).movePointLeft(2).setScale(2, java.math.RoundingMode.HALF_EVEN);
        } else {
            gross = BigDecimal.ZERO;
        }

        String currency = session.getCurrency() != null ? session.getCurrency().toUpperCase() : null;
        stripeCheckoutCompletionHandler.finalizeFromCheckoutSession(sessionId, pi, gross, currency);
    }

    private void failPaymentSafe(Event event) throws EventDataObjectDeserializationException {
        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer().deserializeUnsafe();
        if (paymentIntent.getId() != null) {
            paymentService.markPaymentFailed(paymentIntent.getId());
        }
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
