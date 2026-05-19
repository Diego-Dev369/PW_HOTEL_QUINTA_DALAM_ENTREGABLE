package com.quintadalam.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.stripe")
public record StripeProperties(
    String mode,
    String secretKey,
    String webhookSecret
) {
}
