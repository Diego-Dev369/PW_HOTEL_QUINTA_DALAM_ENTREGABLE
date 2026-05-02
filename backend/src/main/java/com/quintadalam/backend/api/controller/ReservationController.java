package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.request.ReservationCreateRequest;
import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.application.service.CurrentUserService;
import com.quintadalam.backend.application.service.ReservationService;
import com.quintadalam.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/reservations")
public class ReservationController {

    private final ReservationService reservationService;
    private final CurrentUserService currentUserService;

    public ReservationController(ReservationService reservationService, CurrentUserService currentUserService) {
        this.reservationService = reservationService;
        this.currentUserService = currentUserService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReservationResponse>> createReservation(
        @Valid @RequestBody ReservationCreateRequest request,
        Authentication authentication
    ) {
        UUID guestUserId = (authentication != null && authentication.isAuthenticated())
            ? currentUserService.resolveRequiredUserIdByEmail(authentication.getName())
            : null;

        return ResponseEntity.ok(ApiResponse.ok(reservationService.createPendingReservation(request, guestUserId)));
    }

    @GetMapping("/guest/{guestUserId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> guestReservations(@PathVariable UUID guestUserId) {
        return ResponseEntity.ok(ApiResponse.ok(reservationService.findGuestReservations(guestUserId)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ReservationResponse>>> myReservations(Authentication authentication) {
        UUID guestUserId = currentUserService.resolveRequiredUserIdByEmail(authentication.getName());
        return ResponseEntity.ok(ApiResponse.ok(reservationService.findGuestReservations(guestUserId)));
    }
}
