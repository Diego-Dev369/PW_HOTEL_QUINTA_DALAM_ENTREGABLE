package com.quintadalam.backend.application.mapper;

import com.quintadalam.backend.application.dto.response.RoomAvailabilityResponse;
import com.quintadalam.backend.domain.projection.RoomAvailabilityProjection;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public RoomAvailabilityResponse toAvailabilityResponse(RoomAvailabilityProjection projection) {
        return new RoomAvailabilityResponse(
            projection.getId(),
            projection.getCode(),
            projection.getName(),
            projection.getSubtitle(),
            projection.getCategory(),
            projection.getCapacity(),
            projection.getNightlyRateAmount(),
            projection.getCurrency()
        );
    }
}
