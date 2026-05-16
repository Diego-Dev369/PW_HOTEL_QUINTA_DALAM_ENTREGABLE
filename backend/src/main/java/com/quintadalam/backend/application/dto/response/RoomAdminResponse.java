package com.quintadalam.backend.application.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Vista administrativa completa de una habitación, incluyendo tarifa actual.
 */
public record RoomAdminResponse(
    UUID id,
    String code,
    String name,
    String subtitle,
    String category,
    String description,
    short capacity,
    String bedType,
    String status,
    boolean featured,
    BigDecimal nightlyRateAmount,
    String currency
) {}
