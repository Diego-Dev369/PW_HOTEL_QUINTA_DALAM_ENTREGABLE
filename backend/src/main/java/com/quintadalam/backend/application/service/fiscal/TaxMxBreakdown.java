package com.quintadalam.backend.application.service.fiscal;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

public record TaxMxBreakdown(
    BigDecimal nightlyRateBeforeTaxPerNight,
    int nights,
    BigDecimal roomBaseTotal,
    BigDecimal ivaAmount,
    BigDecimal ishAmount,
    BigDecimal taxesTotal,
    BigDecimal grandTotal,
    BigDecimal ivaRate,
    BigDecimal ishRate
) {
    public Map<String, Object> toSnapshot() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("model", "MX_LODGING_SIMPLE");
        m.put("nightlyRateBeforeTaxPerNight", nightlyRateBeforeTaxPerNight);
        m.put("nights", nights);
        m.put("roomBaseTotal", roomBaseTotal);
        m.put("ivaRate", ivaRate);
        m.put("ishRate", ishRate);
        m.put("ivaAmount", ivaAmount);
        m.put("ishAmount", ishAmount);
        m.put("taxesTotal", taxesTotal);
        m.put("grandTotal", grandTotal);
        return m;
    }
}
