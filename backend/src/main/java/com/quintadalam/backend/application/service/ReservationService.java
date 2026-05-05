package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.AvailabilitySearchRequest;
import com.quintadalam.backend.application.dto.request.ReservationCreateRequest;
import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.application.dto.response.RoomAvailabilityResponse;
import com.quintadalam.backend.application.mapper.ReservationMapper;
import com.quintadalam.backend.application.mapper.RoomMapper;
import com.quintadalam.backend.application.service.fiscal.TaxMxBreakdown;
import com.quintadalam.backend.application.service.fiscal.TaxMxService;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.enums.ReservationStatus;
import com.quintadalam.backend.domain.enums.RoomStatus;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.model.Room;
import com.quintadalam.backend.domain.repository.ReservationRepository;
import com.quintadalam.backend.domain.repository.RoomRateRepository;
import com.quintadalam.backend.domain.repository.RoomRepository;
import jakarta.persistence.EntityManager;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final RoomRepository roomRepository;
    private final RoomRateRepository roomRateRepository;
    private final ReservationRepository reservationRepository;
    private final RoomMapper roomMapper;
    private final ReservationMapper reservationMapper;
    private final TaxMxService taxMxService;
    private final EntityManager entityManager;

    public ReservationService(
        RoomRepository roomRepository,
        RoomRateRepository roomRateRepository,
        ReservationRepository reservationRepository,
        RoomMapper roomMapper,
        ReservationMapper reservationMapper,
        TaxMxService taxMxService,
        EntityManager entityManager
    ) {
        this.roomRepository = roomRepository;
        this.roomRateRepository = roomRateRepository;
        this.reservationRepository = reservationRepository;
        this.roomMapper = roomMapper;
        this.reservationMapper = reservationMapper;
        this.taxMxService = taxMxService;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public List<RoomAvailabilityResponse> searchAvailability(AvailabilitySearchRequest request) {
        validateDateRange(request.checkIn(), request.checkOut());

        return roomRepository.findAvailableRooms(request.checkIn(), request.checkOut(), request.guests())
            .stream()
            .map(roomMapper::toAvailabilityResponse)
            .toList();
    }

    @Transactional
    public ReservationResponse createPendingReservation(ReservationCreateRequest request, UUID guestUserId) {
        validateDateRange(request.checkIn(), request.checkOut());

        Room room = roomRepository.findByIdAndStatus(request.roomId(), RoomStatus.ACTIVE)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "ROOM_NOT_FOUND", "Habitación no disponible."));

        if (request.guestsCount() > room.getCapacity()) {
            throw new BusinessException(HttpStatus.CONFLICT, "ROOM_CAPACITY_EXCEEDED", "La capacidad de la suite fue superada.");
        }

        RoomRateRepository.RateSnapshot snapshot = roomRateRepository.findRateForDate(room.getId(), request.checkIn())
            .orElseThrow(() -> new BusinessException(HttpStatus.CONFLICT, "RATE_NOT_FOUND", "No existe tarifa vigente para la fecha seleccionada."));

        long nightsLong = ChronoUnit.DAYS.between(request.checkIn(), request.checkOut());
        int nights = Math.toIntExact(nightsLong);
        TaxMxBreakdown fx = taxMxService.computeLodgingTotals(snapshot.getNightlyRateAmount(), nights);

        Reservation reservation = new Reservation();
        reservation.setGuestUserId(guestUserId);
        reservation.setRoom(room);
        reservation.setStatus(ReservationStatus.PENDING_PAYMENT);
        reservation.setCheckIn(request.checkIn());
        reservation.setCheckOut(request.checkOut());
        reservation.setGuestsCount(request.guestsCount());
        reservation.setGuestFullName(request.guestFullName());
        reservation.setGuestEmail(request.guestEmail().trim().toLowerCase());
        reservation.setGuestPhone(request.guestPhone());
        reservation.setSpecialRequests(request.specialRequests());
        reservation.setNightlyRateAmount(snapshot.getNightlyRateAmount().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setCurrency(snapshot.getCurrency());
        reservation.setRoomBaseAmount(fx.roomBaseTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setIvaAmount(fx.ivaAmount().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setIshAmount(fx.ishAmount().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setSubtotalAmount(fx.roomBaseTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setTaxesAmount(fx.taxesTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setTotalAmount(fx.grandTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setPricingSnapshot(fx.toSnapshot());
        reservation.setReservationCode(generateReservationCode());
        Reservation saved = reservationRepository.saveAndFlush(reservation);
        entityManager.refresh(saved);
        return reservationMapper.toResponse(saved);
    }

    /**
     * @deprecated El estado económico ahora lo gobierna payment_ledger + ReservationFinanceSynchronizer.
     */
    @Deprecated(forRemoval = true)
    @Transactional
    public void confirmReservation(UUID reservationId) {
        Reservation reservation = reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada."));
        reservation.setStatus(ReservationStatus.CONFIRMED);
        reservationRepository.save(reservation);
    }

    @Transactional
    public void cancelReservation(UUID reservationId, String reason) {
        Reservation reservation = reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada."));

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservation.setCancellationReason(reason);
        reservation.setCancelledAt(java.time.Instant.now());
        reservation.setDeletedAt(java.time.Instant.now());
        reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public Reservation getReservationEntity(UUID reservationId) {
        return reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada."));
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> findGuestReservations(UUID guestUserId) {
        return reservationRepository.findByGuestUserIdAndDeletedAtIsNullOrderByCheckInDesc(guestUserId)
            .stream()
            .map(reservationMapper::toResponse)
            .toList();
    }

    private void validateDateRange(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_DATES", "La fecha de salida debe ser posterior a la de entrada.");
        }
    }
    private String generateReservationCode() {
    Long folio = ((Number) entityManager
        .createNativeQuery("SELECT nextval('hotel.reservation_folio_seq')")
        .getSingleResult())
        .longValue();

    return "RES-" +
        java.time.LocalDate.now().format(
            java.time.format.DateTimeFormatter.BASIC_ISO_DATE
        ) +
        "-" +
        String.format("%05d", folio);
}
}
