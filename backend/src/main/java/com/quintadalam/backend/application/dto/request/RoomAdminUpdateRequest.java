package com.quintadalam.backend.application.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Request para actualización administrativa de una habitación.
 * El campo {@code nightlyRateGross} es el precio BRUTO por noche (impuestos incluidos)
 * que se mostrará al cliente y se cobrará exactamente en Stripe.
 */
public record RoomAdminUpdateRequest(

    @NotBlank(message = "El nombre no puede estar vacío")
    @Size(max = 120)
    String name,

    @Size(max = 180)
    String subtitle,

    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 60)
    String category,

    @Size(max = 5000)
    String description,

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "Capacidad mínima 1")
    @Max(value = 20, message = "Capacidad máxima 20")
    Short capacity,

    @Size(max = 80)
    String bedType,

    /** ACTIVE | INACTIVE | MAINTENANCE */
    @NotBlank(message = "El estado es obligatorio")
    String status,

    Boolean featured,

    /**
     * Precio bruto por noche (IVA + ISH incluidos).
     * Si se envía, se actualiza la tarifa vigente futura en room_rates.
     */
    @DecimalMin(value = "1.00", message = "El precio debe ser mayor a 0")
    BigDecimal nightlyRateGross,

    /** Moneda ISO-4217; si null se asume MXN */
    String currency
) {}
