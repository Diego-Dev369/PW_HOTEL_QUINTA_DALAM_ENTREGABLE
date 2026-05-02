package com.quintadalam.backend.domain.projection;

import java.math.BigDecimal;
import java.util.UUID;

public interface RoomAvailabilityProjection {
    UUID getId();
    String getCode();
    String getName();
    String getSubtitle();
    String getCategory();
    Short getCapacity();
    BigDecimal getNightlyRateAmount();
    String getCurrency();
}
