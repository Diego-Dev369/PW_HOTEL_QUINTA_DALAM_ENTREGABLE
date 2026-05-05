package com.quintadalam.backend.config;

import com.stripe.Stripe;
import jakarta.annotation.PostConstruct;
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
        Stripe.apiKey = sk != null ? sk : "";
    }
}
