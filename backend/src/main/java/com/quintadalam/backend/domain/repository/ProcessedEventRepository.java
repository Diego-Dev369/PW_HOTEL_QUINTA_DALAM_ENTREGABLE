package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.ProcessedEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ProcessedEventRepository extends JpaRepository<ProcessedEvent, UUID> {
    Optional<ProcessedEvent> findByProviderAndEventId(String provider, String eventId);
}
