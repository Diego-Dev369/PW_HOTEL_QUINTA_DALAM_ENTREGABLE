package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.ReceptionWalkInRequest;
import com.quintadalam.backend.application.dto.response.OperationalDashboardResponse;
import com.quintadalam.backend.application.dto.response.PageResponse;
import com.quintadalam.backend.application.dto.response.ReservationResponse;
import com.quintadalam.backend.application.mapper.ReservationMapper;
import com.quintadalam.backend.application.service.fiscal.TaxMxBreakdown;
import com.quintadalam.backend.application.service.fiscal.TaxMxService;
import com.quintadalam.backend.application.service.payments.ReservationFinanceSynchronizer;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.enums.LedgerPaymentMethod;
import com.quintadalam.backend.domain.enums.ReservationStatus;
import com.quintadalam.backend.domain.enums.RoomStatus;
import com.quintadalam.backend.domain.model.PaymentLedgerEntry;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.model.Room;
import com.quintadalam.backend.domain.repository.PaymentLedgerRepository;
import com.quintadalam.backend.domain.repository.ReservationRepository;
import com.quintadalam.backend.domain.repository.RoomRateRepository;
import com.quintadalam.backend.domain.repository.RoomRepository;
import jakarta.persistence.EntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class OperationalDeskService {

    private static final List<ReservationStatus> ARRIVAL_DAY_STATUSES = List.of(
        ReservationStatus.PENDING_PAYMENT,
        ReservationStatus.PARTIALLY_PAID,
        ReservationStatus.CONFIRMED
    );

    private static final List<ReservationStatus> DEPARTURE_DAY_STATUSES = List.of(
        ReservationStatus.PARTIALLY_PAID,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN
    );

    private static final List<ReservationStatus> OCCUPANCY_BLOCKING_STATUSES = List.of(
        ReservationStatus.PENDING_PAYMENT,
        ReservationStatus.PARTIALLY_PAID,
        ReservationStatus.CONFIRMED,
        ReservationStatus.CHECKED_IN
    );

    private static final List<ReservationStatus> MONTH_EXCLUSIONS_FOR_OPEN_PIPELINE = List.of(
        ReservationStatus.CANCELLED,
        ReservationStatus.CHECKED_OUT,
        ReservationStatus.NO_SHOW
    );

    private final RoomRepository roomRepository;
    private final RoomRateRepository roomRateRepository;
    private final ReservationRepository reservationRepository;
    private final PaymentLedgerRepository paymentLedgerRepository;
    private final TaxMxService taxMxService;
    private final ReservationFinanceSynchronizer reservationFinanceSynchronizer;
    private final ReservationMapper reservationMapper;
    private final EntityManager entityManager;

    public OperationalDeskService(
        RoomRepository roomRepository,
        RoomRateRepository roomRateRepository,
        ReservationRepository reservationRepository,
        PaymentLedgerRepository paymentLedgerRepository,
        TaxMxService taxMxService,
        ReservationFinanceSynchronizer reservationFinanceSynchronizer,
        ReservationMapper reservationMapper,
        EntityManager entityManager
    ) {
        this.roomRepository = roomRepository;
        this.roomRateRepository = roomRateRepository;
        this.reservationRepository = reservationRepository;
        this.paymentLedgerRepository = paymentLedgerRepository;
        this.taxMxService = taxMxService;
        this.reservationFinanceSynchronizer = reservationFinanceSynchronizer;
        this.reservationMapper = reservationMapper;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public OperationalDashboardResponse dashboard(LocalDate dayUtc) {
        LocalDate pivot = dayUtc != null ? dayUtc : LocalDate.now(java.time.ZoneOffset.UTC);
        long arrivals = reservationRepository.findArrivalsOn(pivot, ARRIVAL_DAY_STATUSES).size();
        long departures = reservationRepository.findDeparturesOn(pivot, DEPARTURE_DAY_STATUSES).size();
        long blocking = reservationRepository.countBlockingOccupanciesOnDay(pivot, OCCUPANCY_BLOCKING_STATUSES);
        long openPipeline = reservationRepository.countOpenOperational(MONTH_EXCLUSIONS_FOR_OPEN_PIPELINE);
        return new OperationalDashboardResponse(pivot, arrivals, departures, blocking, openPipeline);
    }

    @Transactional(readOnly = true)
    public PageResponse<ReservationResponse> listReservations(int page, int size) {
        Pageable pb = PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 200), Sort.by(Sort.Direction.DESC, "checkIn"));
        Page<Reservation> p = reservationRepository.findByDeletedAtIsNullOrderByCheckInDesc(pb);
        List<ReservationResponse> mapped = p.getContent().stream().map(reservationMapper::toResponse).toList();
        return new PageResponse<>(mapped, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }

    @Transactional
    public ReservationResponse walkIn(ReceptionWalkInRequest request, UUID staffUserId) {
        validateDateRange(request.checkIn(), request.checkOut());

        Room room = roomRepository.findByIdAndStatus(request.roomId(), RoomStatus.ACTIVE)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "ROOM_NOT_FOUND", "Habitación no disponible."));

        if (request.guestsCount() > room.getCapacity()) {
            throw new BusinessException(HttpStatus.CONFLICT, "ROOM_CAPACITY_EXCEEDED", "La capacidad fue superada.");
        }

        RoomRateRepository.RateSnapshot snapshot = roomRateRepository.findRateForDate(room.getId(), request.checkIn())
            .orElseThrow(() -> new BusinessException(HttpStatus.CONFLICT, "RATE_NOT_FOUND", "No existe tarifa vigente."));

        int nights = Math.toIntExact(java.time.temporal.ChronoUnit.DAYS.between(request.checkIn(), request.checkOut()));

        TaxMxBreakdown fx = taxMxService.computeLodgingTotals(snapshot.getNightlyRateAmount(), nights);
        Reservation reservation = new Reservation();
        reservation.setGuestUserId(null);
        reservation.setRoom(room);
        reservation.setCheckIn(request.checkIn());
        reservation.setCheckOut(request.checkOut());
        reservation.setGuestsCount(request.guestsCount());
        reservation.setGuestFullName(request.guestFullName().trim());
        reservation.setGuestEmail(request.guestEmail().trim().toLowerCase());
        reservation.setGuestPhone(request.guestPhone());
        reservation.setNightlyRateAmount(snapshot.getNightlyRateAmount().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setCurrency(snapshot.getCurrency());
        reservation.setRoomBaseAmount(fx.roomBaseTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setIvaAmount(fx.ivaAmount().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setIshAmount(fx.ishAmount().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setSubtotalAmount(fx.roomBaseTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setTaxesAmount(fx.taxesTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setTotalAmount(fx.grandTotal().setScale(2, RoundingMode.HALF_EVEN));
        reservation.setPricingSnapshot(fx.toSnapshot());

        Set<LedgerPaymentMethod> cashOps = EnumSet.of(
            LedgerPaymentMethod.CASH,
            LedgerPaymentMethod.BANK_TRANSFER,
            LedgerPaymentMethod.ADJUSTMENT
        );

        if (request.complimentary()) {
            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservation.setSpecialRequests(mergeNote(request.note(), "[CORTESÍA RECEPCIÓN]"));
            Reservation saved = reservationRepository.saveAndFlush(reservation);
            entityManager.refresh(saved);
            return reservationMapper.toResponse(saved);
        }

        if (request.method() == null || !cashOps.contains(request.method())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_MANUAL_PAYMENT_METHOD", "Método manual inválido para walk-in.");
        }
        BigDecimal collected = request.collectedAmount();
        if (collected == null || collected.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_COLLECTED_AMOUNT", "Captura obligatoria de monto efectivo.");
        }

        int payableVsTotal = collected.setScale(2, RoundingMode.HALF_EVEN)
            .compareTo(reservation.getTotalAmount());

        if (payableVsTotal < 0) {
            reservation.setStatus(ReservationStatus.PARTIALLY_PAID);
        } else {
            reservation.setStatus(ReservationStatus.CONFIRMED);
        }
        reservation.setSpecialRequests(request.note());

        Reservation savedCore = reservationRepository.saveAndFlush(reservation);
        entityManager.refresh(savedCore);

        PaymentLedgerEntry entry = new PaymentLedgerEntry();
        entry.setReservation(savedCore);
        entry.setMethod(request.method());
        entry.setAmount(collected.setScale(2, RoundingMode.HALF_EVEN));
        entry.setCurrency(savedCore.getCurrency());
        entry.setNote(StringUtils.hasText(request.note()) ? request.note().trim() : "Walk-in recepción");
        entry.setRecordedBy(staffUserId);
        paymentLedgerRepository.save(entry);

        reservationFinanceSynchronizer.synchronizeAfterLedgerChange(savedCore);
        reservationRepository.save(savedCore);
        entityManager.refresh(savedCore);
        return reservationMapper.toResponse(savedCore);
    }

    @Transactional
    public ReservationResponse checkIn(UUID reservationId) {
        Reservation r = reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada."));

        if (!(r.getStatus() == ReservationStatus.CONFIRMED || r.getStatus() == ReservationStatus.PARTIALLY_PAID)) {
            throw new BusinessException(HttpStatus.CONFLICT, "CHECKIN_INVALID_STATE", "Sólo pueden ingresar reservaciones confirmadas o con saldo parcial autorizado.");
        }

        if (!isCourtesyReservation(r)) {
            BigDecimal ledgerNet = nz(paymentLedgerRepository.sumAmountByReservationId(r.getId()));
            BigDecimal balance = r.getTotalAmount().subtract(ledgerNet).setScale(2, RoundingMode.HALF_EVEN);
            if (balance.compareTo(BigDecimal.ZERO) > 0) {
                throw new BusinessException(HttpStatus.CONFLICT, "CHECKIN_UNPAID_BALANCE",
                    "Aún existe saldo pendiente de " + balance + " " + r.getCurrency() + ".");
            }
        }

        r.setStatus(ReservationStatus.CHECKED_IN);
        reservationRepository.save(r);
        return reservationMapper.toResponse(r);
    }

    @Transactional
    public ReservationResponse manualSettlement(UUID reservationId, LedgerPaymentMethod method, BigDecimal amount,
                                                UUID staffUserId, String note) {
        if (method == null || amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_MANUAL_PAYMENT", "Monto inválido.");
        }
        if (method == LedgerPaymentMethod.STRIPE_CARD || method == LedgerPaymentMethod.STRIPE_REFUND) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_LEDGER_ROUTE", "Use Stripe u operaciones financieras dedicadas.");
        }

        Reservation r = reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada."));

        PaymentLedgerEntry entry = new PaymentLedgerEntry();
        entry.setReservation(r);
        entry.setMethod(method);
        entry.setAmount(amount.setScale(2, RoundingMode.HALF_EVEN));
        entry.setCurrency(r.getCurrency());
        entry.setNote(note);
        entry.setRecordedBy(staffUserId);
        paymentLedgerRepository.save(entry);

        reservationFinanceSynchronizer.synchronizeAfterLedgerChange(r);
        reservationRepository.save(r);
        return reservationMapper.toResponse(r);
    }

    @Transactional
    public ReservationResponse checkOut(UUID reservationId) {
        Reservation r = reservationRepository.findByIdAndDeletedAtIsNull(reservationId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "RESERVATION_NOT_FOUND", "Reservación no encontrada."));
        if (r.getStatus() != ReservationStatus.CHECKED_IN) {
            throw new BusinessException(HttpStatus.CONFLICT, "CHECKOUT_REQUIRES_CHECKIN", "Check-out sólo después de CHECKED_IN.");
        }
        r.setStatus(ReservationStatus.CHECKED_OUT);
        reservationRepository.save(r);
        return reservationMapper.toResponse(r);
    }

    private String mergeNote(String note, String auto) {
        if (!StringUtils.hasText(note)) {
            return auto;
        }
        return note.trim() + " | " + auto;
    }

    private void validateDateRange(LocalDate checkIn, LocalDate checkOut) {
        if (checkIn == null || checkOut == null || !checkOut.isAfter(checkIn)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_DATES", "Las fechas de estadía son inválidas.");
        }
    }

    private static BigDecimal nz(BigDecimal b) {
        return b == null ? BigDecimal.ZERO : b;
    }

    private boolean isCourtesyReservation(Reservation r) {
        return r.getSpecialRequests() != null && r.getSpecialRequests().contains("[CORTESÍA RECEPCIÓN]");
    }
}
