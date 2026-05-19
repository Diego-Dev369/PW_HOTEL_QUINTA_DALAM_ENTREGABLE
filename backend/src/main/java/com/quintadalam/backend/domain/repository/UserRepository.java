package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query(value = "SELECT * FROM hotel.users ORDER BY created_at DESC", nativeQuery = true)
    List<User> findAllIncludingDeleted();

    @Query(value = "SELECT * FROM hotel.users WHERE id = CAST(:id AS uuid)", nativeQuery = true)
    Optional<User> findByIdIncludingDeleted(@Param("id") String id);
}
