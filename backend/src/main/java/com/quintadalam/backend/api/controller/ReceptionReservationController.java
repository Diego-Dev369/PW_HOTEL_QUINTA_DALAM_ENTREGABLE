package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.request.ReceptionManualSettlementRequest;
import com.quintadalam.backend.application.dto.request.ReceptionWalkInRequest;
import com.quintadalam.backend.application.dto.response.OperationalDashboardResponse;
import com.quintadalam.backend.application.dto.response.PageResponse;
import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.application.service.CurrentUserService;
import com.quintadalam.backend.application.service.OperationalDeskService;
import com.quintadalam.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reception")
public class ReceptionReservationController {

    private final OperationalDeskService operationalDeskService;
    private final CurrentUserService currentUserService;

    public ReceptionReservationController(OperationalDeskService operationalDeskService, CurrentUserService currentUserService) {
        this.operationalDeskService = operationalDeskService;
        this.currentUserService = currentUserService;
    }

    @GetMapping("/reservations")
    public ResponseEntity<ApiResponse<PageResponse<ReservationResponse>>> page(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(ApiResponse.ok(operationalDeskService.listReservations(page, size)));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<OperationalDashboardResponse>> dashboard(
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) java.time.LocalDate date
    ) {
        return ResponseEntity.ok(ApiResponse.ok(operationalDeskService.dashboard(date)));
    }

    @PostMapping("/reservations/walk-in")
    public ResponseEntity<ApiResponse<ReservationResponse>> walkIn(
        @Valid @RequestBody ReceptionWalkInRequest body,
        Authentication authentication
    ) {
        UUID staff = authentication != null
            ? currentUserService.resolveRequiredUserIdByEmail(authentication.getName())
            : null;
        return ResponseEntity.ok(ApiResponse.ok(operationalDeskService.walkIn(body, staff)));
    }

    @PostMapping("/reservations/{id}/check-in")
    public ResponseEntity<ApiResponse<ReservationResponse>> checkIn(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(operationalDeskService.checkIn(id)));
    }

    @PostMapping("/reservations/{id}/check-out")
    public ResponseEntity<ApiResponse<ReservationResponse>> checkOut(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(operationalDeskService.checkOut(id)));
    }

    @PostMapping("/reservations/{id}/manual-settlements")
    public ResponseEntity<ApiResponse<ReservationResponse>> manualSettlement(
        @PathVariable UUID id,
        @Valid @RequestBody ReceptionManualSettlementRequest body,
        Authentication authentication
    ) {
        UUID staff = authentication != null
            ? currentUserService.resolveRequiredUserIdByEmail(authentication.getName())
            : null;
        return ResponseEntity.ok(ApiResponse.ok(
            operationalDeskService.manualSettlement(id, body.method(), body.amount(), staff, body.note())
        ));
    }
}
