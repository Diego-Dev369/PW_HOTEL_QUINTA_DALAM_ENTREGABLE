package com.quintadalam.backend.domain.model;

import com.quintadalam.backend.common.domain.AuditableSoftDeleteEntity;
import com.quintadalam.backend.domain.enums.ReservationStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.sql.Types;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "reservations", schema = "hotel")
@SQLDelete(sql = "UPDATE hotel.reservations SET deleted_at = NOW(), cancelled_at = NOW(), status = 'CANCELLED', updated_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Reservation extends AuditableSoftDeleteEntity {

    @Column(name = "reservation_code", nullable = false, unique = true, length = 30)
    private String reservationCode;

    @Column(name = "guest_user_id")
    private UUID guestUserId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING_PAYMENT;

    @Column(name = "check_in", nullable = false)
    private LocalDate checkIn;

    @Column(name = "check_out", nullable = false)
    private LocalDate checkOut;

    @Column(name = "guests_count", nullable = false)
    private short guestsCount;

    @Column(name = "guest_full_name", nullable = false, length = 180)
    private String guestFullName;

    @Column(name = "guest_email", nullable = false, length = 255)
    private String guestEmail;

    @Column(name = "guest_phone", length = 30)
    private String guestPhone;

    @Column(name = "nightly_rate_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal nightlyRateAmount;

    @JdbcTypeCode(Types.CHAR)
    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "subtotal_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotalAmount;

    @Column(name = "taxes_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal taxesAmount;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "special_requests")
    private String specialRequests;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;
}
