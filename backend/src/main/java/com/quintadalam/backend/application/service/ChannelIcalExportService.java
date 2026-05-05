package com.quintadalam.backend.application.service;

import com.quintadalam.backend.domain.enums.ReservationStatus;
import com.quintadalam.backend.domain.model.Reservation;
import com.quintadalam.backend.domain.model.Room;
import com.quintadalam.backend.domain.repository.ReservationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class ChannelIcalExportService {

    private static final DateTimeFormatter ICS_DT = DateTimeFormatter.ofPattern("yyyyMMdd");

    private final ReservationRepository reservationRepository;

    public ChannelIcalExportService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @Transactional(readOnly = true)
    public String exportBlockingCalendar(LocalDate fromUtc, LocalDate toUtcExclusive) {
        LocalDate start = fromUtc != null ? fromUtc : LocalDate.now(ZoneOffset.UTC);
        LocalDate endCap = toUtcExclusive != null ? toUtcExclusive : start.plusMonths(6);

        List<Reservation> rows = reservationRepository.findActiveReservationsIntersecting(
            ReservationStatus.CANCELLED,
            start,
            endCap
        );

        StringBuilder ics = new StringBuilder();
        ics.append("BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Hotel Quinta Dalam//ES\r\nCALSCALE:GREGORIAN\r\n");
        for (Reservation r : rows) {
            Room room = r.getRoom();
            UUID uidSeed = r.getId();
            String uid = uidSeed.toString().toUpperCase() + "@quintadalam.hotel";

            String summary = sanitize("BLOQUEO " + r.getReservationCode() + " / " + room.getName());

            LocalDate dtStartDay = r.getCheckIn();
            LocalDate dtEndExclusive = r.getCheckOut();

            ics.append("BEGIN:VEVENT\r\n")
                .append("UID:").append(uid).append("\r\n")
                .append("DTSTAMP:").append(UTC_NOW()).append("\r\n")
                .append("DTSTART;VALUE=DATE:").append(ICS_DT.format(dtStartDay)).append("\r\n")
                .append("DTEND;VALUE=DATE:").append(ICS_DT.format(dtEndExclusive)).append("\r\n")
                .append("SUMMARY:").append(summary).append("\r\n")
                .append("STATUS:").append(reservationBlockingStatusLiteral(r)).append("\r\n")
                .append("END:VEVENT\r\n");
        }
        ics.append("END:VCALENDAR\r\n");
        return ics.toString();
    }

    private static String reservationBlockingStatusLiteral(Reservation reservation) {
        return switch (reservation.getStatus()) {
            case CANCELLED, CHECKED_OUT, NO_SHOW -> "CANCELLED";
            default -> "CONFIRMED";
        };
    }

    private static String sanitize(String raw) {
        return raw.replace("\r", "").replace("\n", " ").replace(",", "\\,").replace(";", "\\;");
    }

    private static String UTC_NOW() {
        return java.time.OffsetDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
    }
}
