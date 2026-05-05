package com.quintadalam.backend.application.dto.response;

import java.time.LocalDate;

public record OperationalDashboardResponse(
    LocalDate pivotDateUtc,
    long arrivals,
    long departures,
    long inHouseBlocking,
    long monthOpenReservationsApprox
) {
}
