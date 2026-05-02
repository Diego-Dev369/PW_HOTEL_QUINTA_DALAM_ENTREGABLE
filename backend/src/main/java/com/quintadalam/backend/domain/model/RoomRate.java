package com.quintadalam.backend.domain.model;

import com.quintadalam.backend.common.domain.AuditableSoftDeleteEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.sql.Types;

@Getter
@Setter
@Entity
@Table(name = "room_rates", schema = "hotel")
@SQLDelete(sql = "UPDATE hotel.room_rates SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class RoomRate extends AuditableSoftDeleteEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "nightly_rate_amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal nightlyRateAmount;

    @JdbcTypeCode(Types.CHAR)
    @Column(name = "currency", nullable = false, length = 3)
    private String currency;

    @Column(name = "note")
    private String note;

    @Transient
    private String validDuring;

    @Column(name = "created_by")
    private java.util.UUID createdBy;

}
