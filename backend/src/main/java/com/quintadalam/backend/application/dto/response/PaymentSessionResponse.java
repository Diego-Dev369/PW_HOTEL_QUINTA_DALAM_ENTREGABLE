package com.quintadalam.backend.application.dto.response;

public record PaymentSessionResponse(
    String sessionId,
    String checkoutUrl
) {
}
