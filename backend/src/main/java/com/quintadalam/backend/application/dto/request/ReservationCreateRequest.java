package com.quintadalam.backend.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.UUID;

public record ReservationCreateRequest(
    @NotNull UUID roomId,
    @NotNull @FutureOrPresent LocalDate checkIn,
    @NotNull @FutureOrPresent LocalDate checkOut,
    @Min(1) short guestsCount,
    @NotBlank String guestFullName,
    @NotBlank @Email String guestEmail,
    String guestPhone,
    String specialRequests
) {
}
