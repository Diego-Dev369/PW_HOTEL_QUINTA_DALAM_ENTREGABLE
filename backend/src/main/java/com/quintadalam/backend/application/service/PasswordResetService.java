package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.ForgotPasswordRequest;
import com.quintadalam.backend.application.dto.request.ResetPasswordRequest;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.config.AppFrontendProperties;
import com.quintadalam.backend.domain.model.PasswordResetToken;
import com.quintadalam.backend.domain.model.User;
import com.quintadalam.backend.domain.repository.PasswordResetTokenRepository;
import com.quintadalam.backend.domain.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;

@Service
public class PasswordResetService {

    private static final Duration TOKEN_TTL = Duration.ofMinutes(30);
    private static final String GENERIC_FORGOT_RESPONSE = "Si el correo está registrado, enviaremos instrucciones para restablecer la contraseña.";

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationOutboxService notificationOutboxService;
    private final AppFrontendProperties appFrontendProperties;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
        UserRepository userRepository,
        PasswordResetTokenRepository passwordResetTokenRepository,
        PasswordEncoder passwordEncoder,
        NotificationOutboxService notificationOutboxService,
        AppFrontendProperties appFrontendProperties
    ) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationOutboxService = notificationOutboxService;
        this.appFrontendProperties = appFrontendProperties;
    }

    @Transactional
    public String forgotPassword(ForgotPasswordRequest request, HttpServletRequest servletRequest) {
        String normalizedEmail = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(normalizedEmail).orElse(null);
        if (user == null) {
            return GENERIC_FORGOT_RESPONSE;
        }

        Instant now = Instant.now();
        passwordResetTokenRepository.invalidateActiveTokensForUser(user.getId(), now);

        String rawToken = generateRawToken();
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setTokenHash(sha256(rawToken));
        token.setExpiresAt(now.plus(TOKEN_TTL));
        token.setRequestedIp(resolveIp(servletRequest));
        token.setUserAgent(resolveUserAgent(servletRequest));
        passwordResetTokenRepository.save(token);

        String resetUrl = buildResetUrl(rawToken);
        String fullName = (user.getFirstName() + " " + user.getLastName()).trim();
        notificationOutboxService.enqueuePasswordReset(user.getEmail(), fullName, resetUrl);

        return GENERIC_FORGOT_RESPONSE;
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        Instant now = Instant.now();
        String tokenHash = sha256(request.token().trim());

        PasswordResetToken token = passwordResetTokenRepository.findActiveByTokenHash(tokenHash, now)
            .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "PASSWORD_RESET_TOKEN_INVALID", "El token es inválido, expiró o ya fue utilizado."));

        User user = token.getUser();
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        token.setUsedAt(now);

        passwordResetTokenRepository.invalidateActiveTokensForUser(user.getId(), now);
        passwordResetTokenRepository.save(token);
        userRepository.save(user);

        return "Contraseña restablecida correctamente.";
    }

    private String buildResetUrl(String rawToken) {
        String baseUrl = appFrontendProperties.baseUrl();
        if (baseUrl == null || baseUrl.isBlank()) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "FRONTEND_BASE_URL_NOT_CONFIGURED", "No existe APP_FRONTEND_BASE_URL configurado.");
        }
        String normalizedBase = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        return normalizedBase + "/reset-password?token=" + rawToken;
    }

    private String generateRawToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (Exception ex) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "HASH_ERROR", "No fue posible generar hash de seguridad.");
        }
    }

    private String resolveIp(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String resolveUserAgent(HttpServletRequest request) {
        if (request == null) {
            return null;
        }
        String ua = request.getHeader("User-Agent");
        if (ua == null) {
            return null;
        }
        return ua.length() > 400 ? ua.substring(0, 400) : ua;
    }
}
