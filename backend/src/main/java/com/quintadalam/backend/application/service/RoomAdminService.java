package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.RoomAdminUpdateRequest;
import com.quintadalam.backend.application.dto.response.RoomAdminResponse;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.enums.RoomStatus;
import com.quintadalam.backend.domain.model.Room;
import com.quintadalam.backend.domain.repository.RoomRepository;
import jakarta.persistence.EntityManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class RoomAdminService {

    private static final Logger log = LoggerFactory.getLogger(RoomAdminService.class);

    private final RoomRepository roomRepository;
    private final EntityManager entityManager;

    public RoomAdminService(RoomRepository roomRepository, EntityManager entityManager) {
        this.roomRepository = roomRepository;
        this.entityManager = entityManager;
    }

    // ─────────────────────────────────────────────
    // GET: lista todas las habitaciones con su tarifa actual
    // ─────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<RoomAdminResponse> listAllRooms() {
        List<Object[]> rows = entityManager.createNativeQuery("""
            SELECT
                r.id,
                r.code,
                r.name,
                r.subtitle,
                r.category,
                r.description,
                r.capacity,
                r.bed_type,
                r.status,
                r.is_featured,
                COALESCE(
                    (SELECT rr.nightly_rate_amount
                     FROM hotel.room_rates rr
                     WHERE rr.room_id = r.id
                       AND rr.deleted_at IS NULL
                       AND rr.valid_during @> CURRENT_DATE
                     ORDER BY lower(rr.valid_during) DESC, rr.created_at DESC
                     LIMIT 1),
                    0
                ) AS nightly_rate_amount,
                COALESCE(
                    (SELECT rr.currency
                     FROM hotel.room_rates rr
                     WHERE rr.room_id = r.id
                       AND rr.deleted_at IS NULL
                       AND rr.valid_during @> CURRENT_DATE
                     ORDER BY lower(rr.valid_during) DESC, rr.created_at DESC
                     LIMIT 1),
                    'MXN'
                ) AS currency
            FROM hotel.rooms r
            WHERE r.deleted_at IS NULL
            ORDER BY r.name
            """).getResultList();

        return rows.stream().map(row -> new RoomAdminResponse(
            UUID.fromString(row[0].toString()),
            (String) row[1],
            (String) row[2],
            (String) row[3],
            (String) row[4],
            (String) row[5],
            ((Number) row[6]).shortValue(),
            (String) row[7],
            (String) row[8],
            Boolean.TRUE.equals(row[9]) || "true".equalsIgnoreCase(String.valueOf(row[9])) || "t".equalsIgnoreCase(String.valueOf(row[9])),
            (row[10] != null) ? new BigDecimal(row[10].toString()) : BigDecimal.ZERO,
            (String) row[11]
        )).toList();
    }

    // ─────────────────────────────────────────────
    // PUT: actualiza campos de la habitación y opcionalmente la tarifa
    // ─────────────────────────────────────────────
    @Transactional
    public RoomAdminResponse updateRoom(UUID roomId, RoomAdminUpdateRequest req) {
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "ROOM_NOT_FOUND", "Habitación no encontrada."));

        // Validar status
        RoomStatus newStatus;
        try {
            newStatus = RoomStatus.valueOf(req.status().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_STATUS",
                "Estado inválido. Usa: ACTIVE, INACTIVE o MAINTENANCE.");
        }

        room.setName(req.name().trim());
        room.setSubtitle(StringUtils.hasText(req.subtitle()) ? req.subtitle().trim() : null);
        room.setCategory(req.category().trim());
        room.setDescription(StringUtils.hasText(req.description()) ? req.description().trim() : null);
        room.setCapacity(req.capacity());
        room.setBedType(StringUtils.hasText(req.bedType()) ? req.bedType().trim() : null);
        room.setStatus(newStatus);
        room.setFeatured(Boolean.TRUE.equals(req.featured()));

        roomRepository.save(room);

        // Actualizar tarifa si se envió
        BigDecimal finalRate = BigDecimal.ZERO;
        String finalCurrency = "MXN";

        if (req.nightlyRateGross() != null && req.nightlyRateGross().compareTo(BigDecimal.ONE) >= 0) {
            String currency = StringUtils.hasText(req.currency())
                ? req.currency().trim().toUpperCase()
                : "MXN";

            // Soft-delete de tarifas actuales vigentes para esta habitación
            int deleted = entityManager.createNativeQuery("""
                UPDATE hotel.room_rates
                SET deleted_at = NOW(), updated_at = NOW()
                WHERE room_id = CAST(:roomId AS uuid)
                  AND deleted_at IS NULL
                  AND valid_during @> CURRENT_DATE
                """)
                .setParameter("roomId", roomId.toString())
                .executeUpdate();

            log.info("Admin room update: soft-deleted {} active rates for room {}", deleted, roomId);

            // Insertar nueva tarifa desde hoy en adelante (rango de 5 años)
            entityManager.createNativeQuery("""
                INSERT INTO hotel.room_rates (room_id, valid_during, nightly_rate_amount, currency, note)
                VALUES (
                    CAST(:roomId AS uuid),
                    daterange(CURRENT_DATE, CURRENT_DATE + 1825, '[)'),
                    CAST(:rate AS numeric),
                    CAST(:currency AS char(3)),
                    'Actualizado por Admin'
                )
                """)
                .setParameter("roomId", roomId.toString())
                .setParameter("rate", req.nightlyRateGross())
                .setParameter("currency", currency)
                .executeUpdate();

            finalRate = req.nightlyRateGross();
            finalCurrency = currency;
            log.info("Admin room update: new rate {} {} for room {}", finalRate, finalCurrency, roomId);
        } else {
            // Recuperar tarifa actual vigente para devolverla en la respuesta
            @SuppressWarnings("unchecked")
            List<Object[]> rates = entityManager.createNativeQuery("""
                SELECT rr.nightly_rate_amount, rr.currency
                FROM hotel.room_rates rr
                WHERE rr.room_id = CAST(:roomId AS uuid)
                  AND rr.deleted_at IS NULL
                  AND rr.valid_during @> CURRENT_DATE
                ORDER BY lower(rr.valid_during) DESC, rr.created_at DESC
                LIMIT 1
                """)
                .setParameter("roomId", roomId.toString())
                .getResultList();

            if (!rates.isEmpty()) {
                Object[] r = rates.get(0);
                finalRate = new BigDecimal(r[0].toString());
                finalCurrency = (String) r[1];
            }
        }

        return new RoomAdminResponse(
            room.getId(),
            room.getCode(),
            room.getName(),
            room.getSubtitle(),
            room.getCategory(),
            room.getDescription(),
            room.getCapacity(),
            room.getBedType(),
            room.getStatus().name(),
            room.isFeatured(),
            finalRate,
            finalCurrency
        );
    }
}
