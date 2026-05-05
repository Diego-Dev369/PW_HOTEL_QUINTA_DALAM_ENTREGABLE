package com.quintadalam.backend.application.service.outbox;

import com.quintadalam.backend.config.OutboxWorkerProperties;
import com.quintadalam.backend.domain.model.NotificationOutboxEntry;
import com.quintadalam.backend.domain.repository.NotificationOutboxRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationOutboxWorker {

    private static final Logger log = LoggerFactory.getLogger(NotificationOutboxWorker.class);

    private final NotificationOutboxRepository outboxRepository;
    private final NotificationEmailComposer emailComposer;
    private final NotificationEmailSender emailSender;
    private final OutboxWorkerProperties properties;
    private final TransactionTemplate txTemplate;

    public NotificationOutboxWorker(
        NotificationOutboxRepository outboxRepository,
        NotificationEmailComposer emailComposer,
        NotificationEmailSender emailSender,
        OutboxWorkerProperties properties,
        PlatformTransactionManager transactionManager
    ) {
        this.outboxRepository = outboxRepository;
        this.emailComposer = emailComposer;
        this.emailSender = emailSender;
        this.properties = properties;
        this.txTemplate = new TransactionTemplate(transactionManager);
    }

    @Scheduled(fixedDelayString = "${app.outbox.worker.fixed-delay-ms:15000}")
    public void pollAndDispatch() {
        if (!properties.enabled()) {
            return;
        }

        List<UUID> claimedIds = claimNextBatch();
        if (claimedIds.isEmpty()) {
            return;
        }

        for (UUID id : claimedIds) {
            processSingle(id);
        }
    }

    private List<UUID> claimNextBatch() {
        return txTemplate.execute(status -> {
            Instant now = Instant.now();
            List<NotificationOutboxEntry> due = outboxRepository.lockDueBatch(now, properties.batchSize());
            if (due.isEmpty()) {
                return List.of();
            }

            List<UUID> claimed = new ArrayList<>(due.size());
            for (NotificationOutboxEntry row : due) {
                row.setStatus("PROCESSING");
                row.setLastError(null);
                claimed.add(row.getId());
            }
            outboxRepository.saveAll(due);
            log.info("Outbox: {} notificaciones reclamadas para envío", claimed.size());
            return claimed;
        });
    }

    private void processSingle(UUID id) {
        NotificationOutboxEntry row = txTemplate.execute(status -> outboxRepository.findById(id).orElse(null));
        if (row == null || !"PROCESSING".equals(row.getStatus())) {
            return;
        }

        try {
            NotificationEmailComposer.EmailEnvelope email = emailComposer.compose(row);
            emailSender.sendHtml(email.to(), email.subject(), email.htmlBody());
            markAsSent(id);
        } catch (Exception ex) {
            markAsFailed(id, ex);
        }
    }

    private void markAsSent(UUID id) {
        txTemplate.executeWithoutResult(status -> {
            NotificationOutboxEntry row = outboxRepository.findById(id).orElse(null);
            if (row == null) {
                return;
            }
            row.setStatus("SENT");
            row.setProcessedAt(Instant.now());
            row.setNextAttemptAt(null);
            row.setDeadLetterAt(null);
            row.setLastError(null);
            outboxRepository.save(row);
            log.info("Outbox SENT kind={} id={}", row.getKind(), row.getId());
        });
    }

    private void markAsFailed(UUID id, Exception ex) {
        txTemplate.executeWithoutResult(status -> {
            NotificationOutboxEntry row = outboxRepository.findById(id).orElse(null);
            if (row == null) {
                return;
            }

            int attempts = row.getAttempts() + 1;
            row.setAttempts(attempts);
            row.setLastError(truncateError(ex));

            Instant now = Instant.now();
            if (attempts >= properties.maxAttempts()) {
                row.setStatus("DEAD_LETTER");
                row.setDeadLetterAt(now);
                row.setProcessedAt(now);
                row.setNextAttemptAt(null);
                log.error("Outbox DEAD_LETTER kind={} id={} attempts={}", row.getKind(), row.getId(), attempts);
            } else {
                row.setStatus("FAILED");
                row.setNextAttemptAt(now.plus(computeBackoff(attempts)));
                log.warn("Outbox FAILED kind={} id={} attempts={} retryAt={}",
                    row.getKind(), row.getId(), attempts, row.getNextAttemptAt());
            }

            outboxRepository.save(row);
        });
    }

    private Duration computeBackoff(int attempts) {
        long minutes = (long) Math.min(720, Math.pow(2, Math.max(0, attempts - 1)));
        return Duration.ofMinutes(minutes);
    }

    private String truncateError(Exception ex) {
        String message = ex.getMessage();
        if (message == null || message.isBlank()) {
            message = ex.getClass().getSimpleName();
        }
        return message.length() > 1500 ? message.substring(0, 1500) : message;
    }
}
