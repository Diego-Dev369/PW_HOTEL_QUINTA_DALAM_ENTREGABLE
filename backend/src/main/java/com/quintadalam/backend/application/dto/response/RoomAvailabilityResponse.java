package com.quintadalam.backend.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record RoomAvailabilityResponse(
    UUID id,
    String code,
    String name,
    String subtitle,
    String category,
    short capacity,
    BigDecimal nightlyRateAmount,
    String currency
) {
}
