package com.quintadalam.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(int loginRequestsPerIpPerMinute) {

    public RateLimitProperties {
        if (loginRequestsPerIpPerMinute <= 0) {
            loginRequestsPerIpPerMinute = 60;
        }
    }
}
