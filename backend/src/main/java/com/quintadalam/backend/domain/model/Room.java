package com.quintadalam.backend.domain.model;

import com.quintadalam.backend.common.domain.AuditableSoftDeleteEntity;
import com.quintadalam.backend.domain.enums.RoomStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;

@Getter
@Setter
@Entity
@Table(name = "rooms", schema = "hotel")
@SQLDelete(sql = "UPDATE hotel.rooms SET deleted_at = NOW(), updated_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class Room extends AuditableSoftDeleteEntity {

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "subtitle")
    private String subtitle;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "description")
    private String description;

    @Column(name = "capacity", nullable = false)
    private Short capacity;

    @Column(name = "size_m2")
    private java.math.BigDecimal sizeM2;

    @Column(name = "bed_type")
    private String bedType;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status", nullable = false)
    private RoomStatus status = RoomStatus.ACTIVE;

    @Column(name = "is_featured", nullable = false)
    private boolean featured;
}
