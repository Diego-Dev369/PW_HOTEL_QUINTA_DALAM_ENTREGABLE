package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.request.StripeCheckoutRequest;
import com.quintadalam.backend.application.dto.response.PaymentSessionResponse;
import com.quintadalam.backend.application.service.PaymentService;
import com.quintadalam.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/checkout-session")
    public ResponseEntity<ApiResponse<PaymentSessionResponse>> createCheckoutSession(
        @Valid @RequestBody StripeCheckoutRequest request
    ) throws Exception {
        return ResponseEntity.ok(ApiResponse.ok(paymentService.createCheckoutSession(request)));
    }
}
