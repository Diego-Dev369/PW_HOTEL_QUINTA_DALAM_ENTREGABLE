package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.request.AvailabilitySearchRequest;
import com.quintadalam.backend.application.dto.response.RoomAvailabilityResponse;
import com.quintadalam.backend.application.service.ReservationService;
import com.quintadalam.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final ReservationService reservationService;

    public RoomController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping("/availability")
    public ResponseEntity<ApiResponse<List<RoomAvailabilityResponse>>> availability(@Valid @ModelAttribute AvailabilitySearchRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(reservationService.searchAvailability(request)));
    }
}
