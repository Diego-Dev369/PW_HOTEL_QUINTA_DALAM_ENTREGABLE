package com.quintadalam.backend.application.service.fiscal;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.quintadalam.backend.domain.model.HotelSetting;
import com.quintadalam.backend.domain.repository.HotelSettingRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Service
public class TaxMxService {

    private static final String SETTINGS_KEY = "tax.mx";

    private final HotelSettingRepository hotelSettingRepository;
    private final ObjectMapper objectMapper;

    public TaxMxService(HotelSettingRepository hotelSettingRepository, ObjectMapper objectMapper) {
        this.hotelSettingRepository = hotelSettingRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * MODELO GROSS PRICE (precio bruto, impuestos incluidos).
     *
     * El parámetro {@code nightlyRateGross} es el precio POR NOCHE que ya incluye IVA + ISH,
     * tal como se almacena en hotel.room_rates y se muestra al cliente.
     *
     * grandTotal  = nightlyRateGross × nights           ← lo que cobra Stripe exactamente
     * taxDivisor  = 1 + ivaRate + ishRate               ← p.ej. 1.19
     * roomBase    = grandTotal / taxDivisor             ← base neta (solo informativo fiscal)
     * ivaAmount   = roomBase × ivaRate
     * ishAmount   = roomBase × ishRate
     *
     * NUNCA se suma nada encima del precio almacenado en BD.
     */
    public TaxMxBreakdown computeLodgingTotals(BigDecimal nightlyRateGross, int nights) {
        if (nightlyRateGross == null || nightlyRateGross.signum() <= 0 || nights <= 0) {
            throw new IllegalArgumentException("Tarifa noches inválidas");
        }

        Rates r = resolveRates();

        // Total final que ve y paga el cliente — exactamente lo que irá a Stripe
        BigDecimal grand = nightlyRateGross
            .multiply(BigDecimal.valueOf(nights), MathContext.DECIMAL64)
            .setScale(2, RoundingMode.HALF_EVEN);

        // Divisor para extraer la base neta del bruto: 1 + IVA + ISH
        BigDecimal taxDivisor = BigDecimal.ONE
            .add(r.ivaRate, MathContext.DECIMAL64)
            .add(r.ishRate, MathContext.DECIMAL64);

        // Base neta = bruto / (1 + IVA + ISH)  — solo desglose fiscal interno
        BigDecimal roomBaseTotal = grand
            .divide(taxDivisor, 6, RoundingMode.HALF_EVEN)
            .setScale(2, RoundingMode.HALF_EVEN);

        // Impuestos extraídos desde el bruto
        BigDecimal iva = roomBaseTotal.multiply(r.ivaRate, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal ish = roomBaseTotal.multiply(r.ishRate, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal taxes = iva.add(ish, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);

        return new TaxMxBreakdown(
            nightlyRateGross,
            nights,
            roomBaseTotal,
            iva,
            ish,
            taxes,
            grand,
            r.ivaRate,
            r.ishRate
        );
    }

    private Rates resolveRates() {
        HotelSetting s = hotelSettingRepository.findById(SETTINGS_KEY).orElse(null);
        BigDecimal iva = new BigDecimal("0.16");
        BigDecimal ish = new BigDecimal("0.03");
        if (s != null && s.getValueJson() != null) {
            try {
                JsonNode node = objectMapper.valueToTree(s.getValueJson());
                if (node.hasNonNull("ivaRate")) {
                    iva = new BigDecimal(node.get("ivaRate").asText());
                }
                if (node.hasNonNull("ishRate")) {
                    ish = new BigDecimal(node.get("ishRate").asText());
                }
            } catch (Exception ignored) {
            }
        }
        return new Rates(iva, ish);
    }

    private record Rates(BigDecimal ivaRate, BigDecimal ishRate) {
    }
}
