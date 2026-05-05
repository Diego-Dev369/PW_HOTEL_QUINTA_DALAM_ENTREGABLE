package com.quintadalam.backend.security;

import com.quintadalam.backend.config.RateLimitProperties;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Refill;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LoginRateLimitFilter.class);

    private final RateLimitProperties rateLimitProperties;

    /**
     * In-memory suficiente para instancia boutique; migra Redis si multi-instancia público SaaS.
     */
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public LoginRateLimitFilter(RateLimitProperties rateLimitProperties) {
        this.rateLimitProperties = rateLimitProperties;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
        throws ServletException, IOException {

        if (!shouldRateLimit(request)) {
            chain.doFilter(request, response);
            return;
        }

        String ip = resolveClientIp(request);
        Bucket bucket = cache.computeIfAbsent(ip, this::newBucket);
        if (!bucket.tryConsume(1)) {
            log.warn("Login rate-limit excedido ip={}", ip);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", "60");
            response.setContentType("application/json");
            response.getWriter().write("{\"code\":\"RATE_LIMITED\",\"message\":\"Demasiados intentos de inicio de sesión. Espere un minuto.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private boolean shouldRateLimit(HttpServletRequest req) {
        return HttpMethod.POST.matches(req.getMethod()) && req.getRequestURI().endsWith("/api/v1/auth/login");
    }

    private Bucket newBucket(String ignored) {
        int cap = Math.max(rateLimitProperties.loginRequestsPerIpPerMinute(), 5);
        Bandwidth bw = Bandwidth.classic(cap, Refill.greedy(cap, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(bw).build();
    }

    private static String resolveClientIp(HttpServletRequest req) {
        String h = req.getHeader("X-Forwarded-For");
        if (h != null && !h.isBlank()) {
            return h.split(",")[0].trim();
        }
        return req.getRemoteAddr() == null ? "unknown" : req.getRemoteAddr();
    }
}
