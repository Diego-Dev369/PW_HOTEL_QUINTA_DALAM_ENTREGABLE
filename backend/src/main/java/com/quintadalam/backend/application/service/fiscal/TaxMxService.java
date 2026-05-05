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

    public TaxMxBreakdown computeLodgingTotals(BigDecimal nightlyRateBeforeTax, int nights) {
        if (nightlyRateBeforeTax == null || nightlyRateBeforeTax.signum() <= 0 || nights <= 0) {
            throw new IllegalArgumentException("Tarifa noches inválidas");
        }

        Rates r = resolveRates();

        BigDecimal roomBaseTotal = nightlyRateBeforeTax.multiply(BigDecimal.valueOf(nights), MathContext.DECIMAL64)
            .setScale(2, RoundingMode.HALF_EVEN);

        BigDecimal iva = roomBaseTotal.multiply(r.ivaRate, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal ish = roomBaseTotal.multiply(r.ishRate, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);

        BigDecimal taxes = iva.add(ish, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);

        BigDecimal grand = roomBaseTotal.add(taxes, MathContext.DECIMAL64).setScale(2, RoundingMode.HALF_EVEN);

        return new TaxMxBreakdown(
            nightlyRateBeforeTax,
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
