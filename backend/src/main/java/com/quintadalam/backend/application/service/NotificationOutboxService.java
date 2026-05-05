package com.quintadalam.backend.application.service;

import com.quintadalam.backend.domain.model.NotificationOutboxEntry;
import com.quintadalam.backend.domain.repository.NotificationOutboxRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class NotificationOutboxService {

    private static final Logger log = LoggerFactory.getLogger(NotificationOutboxService.class);

    private final NotificationOutboxRepository notificationOutboxRepository;

    public NotificationOutboxService(NotificationOutboxRepository notificationOutboxRepository) {
        this.notificationOutboxRepository = notificationOutboxRepository;
    }

    @Transactional
    public void enqueuePaymentSuccess(UUID reservationId, Map<String, Object> extras) {
        persist("PAYMENT_SUCCESS", reservationId, extras);
        log.debug("Encolado outbox PAYMENT_SUCCESS reserva {}", reservationId);
    }

    @Transactional
    public void enqueueBookingConfirmed(UUID reservationId, Map<String, Object> extras) {
        persist("RESERVATION_CONFIRMED", reservationId, extras);
        log.debug("Encolado outbox RESERVATION_CONFIRMED reserva {}", reservationId);
    }

    @Transactional
    public void enqueuePasswordReset(String email, String fullName, String resetUrl) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("email", email);
        payload.put("fullName", fullName);
        payload.put("resetUrl", resetUrl);
        persist("PASSWORD_RESET_REQUEST", null, payload);
        log.debug("Encolado outbox PASSWORD_RESET_REQUEST para {}", email);
    }

    private void persist(String kind, UUID reservationId, Map<String, Object> extras) {
        NotificationOutboxEntry row = new NotificationOutboxEntry();
        row.setKind(kind);
        row.setReservationId(reservationId);
        Map<String, Object> payload = new LinkedHashMap<>();
        if (extras != null && !extras.isEmpty()) {
            payload.putAll(extras);
        }
        row.setPayload(payload);
        row.setStatus("PENDING");
        row.setAttempts(0);
        row.setNextAttemptAt(null);
        row.setDeadLetterAt(null);
        notificationOutboxRepository.save(row);
    }
}
