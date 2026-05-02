package com.quintadalam.backend.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record StripeCheckoutRequest(
    @NotNull UUID reservationId,
    @NotBlank String successUrl,
    @NotBlank String cancelUrl,
    String idempotencyKey
) {
}
