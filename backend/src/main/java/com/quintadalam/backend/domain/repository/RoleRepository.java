package com.quintadalam.backend.domain.repository;

import com.quintadalam.backend.domain.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Short> {
    @Query(value = "SELECT id, code, name FROM hotel.roles WHERE code = CAST(:code AS hotel.role_code)", nativeQuery = true)
    Optional<Role> findByCode(@Param("code") String code);
}
