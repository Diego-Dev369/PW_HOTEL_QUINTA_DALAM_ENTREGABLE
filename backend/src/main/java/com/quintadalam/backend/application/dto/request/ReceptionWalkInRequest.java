package com.quintadalam.backend.application.dto.request;

import com.quintadalam.backend.domain.enums.LedgerPaymentMethod;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ReceptionWalkInRequest(
    @NotNull UUID roomId,
    @NotNull LocalDate checkIn,
    @NotNull LocalDate checkOut,
    @NotNull @Positive short guestsCount,
    @NotBlank String guestFullName,
    @NotBlank @Email String guestEmail,
    String guestPhone,
    /** Cortesías internas autorizadas vía proceso operativo estándar. */
    boolean complimentary,
    LedgerPaymentMethod method,
    BigDecimal collectedAmount,
    String note
) {
}
