package com.quintadalam.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.outbox.worker")
public record OutboxWorkerProperties(
    boolean enabled,
    long fixedDelayMs,
    int batchSize,
    int maxAttempts
) {
}
