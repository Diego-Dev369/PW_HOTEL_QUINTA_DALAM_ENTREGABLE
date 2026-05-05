package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.response.OperationalDashboardResponse;
import com.quintadalam.backend.application.dto.response.PageResponse;
import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.application.service.OperationalDeskService;
import com.quintadalam.backend.common.response.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/reservations")
public class AdminReservationController {

    private final OperationalDeskService operationalDeskService;

    public AdminReservationController(OperationalDeskService operationalDeskService) {
        this.operationalDeskService = operationalDeskService;
    }

    @GetMapping
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
}
