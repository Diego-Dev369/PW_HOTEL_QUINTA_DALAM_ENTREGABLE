package com.quintadalam.backend.security;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.security")
public record JwtProperties(
    String jwtSecret,
    long jwtExpirationSeconds,
    long jwtRefreshExpirationSeconds,
    boolean requireStrongJwtSecret
) {

    public JwtProperties {
        if (jwtExpirationSeconds <= 0) {
            jwtExpirationSeconds = 7200L;
        }
        if (jwtRefreshExpirationSeconds <= 0) {
            jwtRefreshExpirationSeconds = 604800L;
        }
    }
}
