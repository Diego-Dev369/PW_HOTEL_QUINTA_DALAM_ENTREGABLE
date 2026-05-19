package com.quintadalam.backend.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
import org.springframework.util.StringUtils;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StripeConfig {

    private final StripeProperties stripeProperties;

    public StripeConfig(StripeProperties stripeProperties) {
        this.stripeProperties = stripeProperties;
    }

    @PostConstruct
    public void setupStripe() {
        String sk = stripeProperties.secretKey();
        String mode = stripeProperties.mode() == null ? "test" : stripeProperties.mode().trim().toLowerCase();

        if (!StringUtils.hasText(sk)) {
            Stripe.apiKey = "";
            return;
        }

        if ("live".equals(mode) && !sk.startsWith("sk_live_")) {
            throw new IllegalStateException("Modo Stripe live requiere PAYMENT_STRIPE_SECRET_KEY con prefijo sk_live_.");
        }
        if ("test".equals(mode) && !sk.startsWith("sk_test_")) {
            throw new IllegalStateException("Modo Stripe test requiere PAYMENT_STRIPE_SECRET_KEY con prefijo sk_test_.");
        }

        Stripe.apiKey = sk != null ? sk : "";
    }
}
