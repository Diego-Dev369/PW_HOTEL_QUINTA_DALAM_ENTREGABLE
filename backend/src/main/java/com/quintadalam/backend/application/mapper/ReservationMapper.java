package com.quintadalam.backend.application.mapper;

import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.domain.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {

    public ReservationResponse toResponse(Reservation reservation) {
        return new ReservationResponse(
            reservation.getId(),
            reservation.getReservationCode(),
            reservation.getRoom().getId(),
            reservation.getStatus(),
            reservation.getCheckIn(),
            reservation.getCheckOut(),
            reservation.getGuestsCount(),
            reservation.getGuestFullName(),
            reservation.getGuestEmail(),
            reservation.getNightlyRateAmount(),
            reservation.getSubtotalAmount(),
            reservation.getTaxesAmount(),
            reservation.getTotalAmount(),
            reservation.getCurrency()
        );
    }
}
