package com.quintadalam.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.frontend")
public record AppFrontendProperties(
    String baseUrl
) {
}
