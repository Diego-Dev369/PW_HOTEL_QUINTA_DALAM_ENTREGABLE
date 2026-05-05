package com.quintadalam.backend.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.Map;

@Getter
@Setter
@Entity
@Table(name = "hotel_settings", schema = "hotel")
public class HotelSetting {

    @Id
    @Column(name = "key", length = 80)
    private String key;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "value_json", nullable = false, columnDefinition = "jsonb")
    private Map<String, Object> valueJson;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}
