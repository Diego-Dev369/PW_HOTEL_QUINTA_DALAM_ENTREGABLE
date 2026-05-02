package com.quintadalam.backend.application.mapper;

import com.quintadalam.backend.application.dto.response.PaymentSessionResponse;
import org.springframework.stereotype.Component;

@Component
public class PaymentMapper {

    public PaymentSessionResponse toSessionResponse(String sessionId, String checkoutUrl) {
        return new PaymentSessionResponse(sessionId, checkoutUrl);
    }
}
