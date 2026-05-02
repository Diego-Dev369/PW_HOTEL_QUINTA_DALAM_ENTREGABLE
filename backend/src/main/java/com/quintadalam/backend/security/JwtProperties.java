package com.quintadalam.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security")
public record JwtProperties(
    String jwtSecret,
    long jwtExpirationSeconds,
    long jwtRefreshExpirationSeconds
) {
}
