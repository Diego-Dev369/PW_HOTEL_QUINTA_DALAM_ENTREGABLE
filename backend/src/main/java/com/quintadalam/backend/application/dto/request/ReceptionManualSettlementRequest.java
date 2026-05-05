package com.quintadalam.backend.application.dto.request;

import com.quintadalam.backend.domain.enums.LedgerPaymentMethod;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public record ReceptionManualSettlementRequest(
    @NotNull LedgerPaymentMethod method,
    @NotNull @Positive BigDecimal amount,
    String note
) {
}
