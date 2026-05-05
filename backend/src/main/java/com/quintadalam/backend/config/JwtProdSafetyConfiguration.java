package com.quintadalam.backend.config;

import com.quintadalam.backend.security.JwtProperties;
import io.jsonwebtoken.io.Decoders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;

@Configuration
@Profile("prod")
public class JwtProdSafetyConfiguration {

    private static final Logger log = LoggerFactory.getLogger(JwtProdSafetyConfiguration.class);

    @Bean
    ApplicationListener<ApplicationReadyEvent> validateJwtStrength(JwtProperties props) {
        return event -> {
            if (!StringUtils.hasText(props.jwtSecret())) {
                throw new IllegalStateException("JWT_SECRET es obligatorio en producción.");
            }
            if (!props.requireStrongJwtSecret()) {
                log.warn(
                    """
                    Producción ejecutando app.security.require-strong-jwt-secret=false. \
                    Asegura que sólo aplique detrás de frontera confiable."""
                );
                return;
            }
            byte[] keyBytes;
            try {
                keyBytes = Decoders.BASE64.decode(props.jwtSecret().trim());
            } catch (Exception ignored) {
                keyBytes = props.jwtSecret().getBytes(StandardCharsets.UTF_8);
            }
            if (keyBytes.length < 32) {
                throw new IllegalStateException("JWT debe ser Base64 válido ≥32 bytes o texto ≥32 chars para HS256 endurecido.");
            }
        };
    }
}
