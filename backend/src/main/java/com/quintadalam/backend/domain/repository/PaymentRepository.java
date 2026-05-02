package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByStripeSessionId(String stripeSessionId);

    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);

    /**
     * Necesario para el mapper: recupera el pago más reciente de una reserva.
     * Usa la columna created_at (heredada de AuditableSoftDeleteEntity).
     */
    Optional<Payment> findTopByReservationIdOrderByCreatedAtDesc(UUID reservationId);
    
}
