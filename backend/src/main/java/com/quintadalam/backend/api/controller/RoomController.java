package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.request.AvailabilitySearchRequest;
import com.quintadalam.backend.application.dto.request.RoomAdminUpdateRequest;
import com.quintadalam.backend.application.dto.response.RoomAdminResponse;
import com.quintadalam.backend.application.dto.response.RoomAvailabilityResponse;
import com.quintadalam.backend.application.service.ReservationService;
import com.quintadalam.backend.application.service.RoomAdminService;
import com.quintadalam.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@Validated
@RestController
@RequestMapping("/api/v1/rooms")
public class RoomController {

    private final ReservationService reservationService;
    private final RoomAdminService roomAdminService;

    public RoomController(ReservationService reservationService, RoomAdminService roomAdminService) {
        this.reservationService = reservationService;
        this.roomAdminService = roomAdminService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoomAdminResponse>>> listPublicRooms() {
        return ResponseEntity.ok(ApiResponse.ok(roomAdminService.listPublicActiveRooms()));
    }

    @GetMapping("/availability")
    public ResponseEntity<ApiResponse<List<RoomAvailabilityResponse>>> availability(
        @Valid @ModelAttribute AvailabilitySearchRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(reservationService.searchAvailability(request)));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin")
    public ResponseEntity<ApiResponse<List<RoomAdminResponse>>> listAdminRooms() {
        return ResponseEntity.ok(ApiResponse.ok(roomAdminService.listAllRooms()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/admin/{id}")
    public ResponseEntity<ApiResponse<RoomAdminResponse>> updateRoom(
        @PathVariable UUID id,
        @Valid @RequestBody RoomAdminUpdateRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(roomAdminService.updateRoom(id, request)));
    }
}



