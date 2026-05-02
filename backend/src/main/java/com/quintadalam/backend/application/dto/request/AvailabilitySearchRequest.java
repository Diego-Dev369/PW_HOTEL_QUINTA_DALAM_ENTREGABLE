package com.quintadalam.backend.application.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AvailabilitySearchRequest(
    @NotNull @FutureOrPresent LocalDate checkIn,
    @NotNull @FutureOrPresent LocalDate checkOut,
    @Min(1) Short guests
) {
}
