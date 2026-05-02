package com.quintadalam.backend.application.service;

import com.quintadalam.backend.domain.repository.UserRepository;
import com.quintadalam.backend.common.error.BusinessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class CurrentUserService {

    private final UserRepository userRepository;

    public CurrentUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UUID resolveUserIdByEmail(String email) {
        if (email == null || email.isBlank()) {
            return null;
        }

        return userRepository.findByEmail(email.trim().toLowerCase())
            .map(u -> u.getId())
            .orElse(null);
    }

    public UUID resolveRequiredUserIdByEmail(String email) {
        UUID userId = resolveUserIdByEmail(email);
        if (userId == null) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_USER_NOT_FOUND", "Usuario autenticado no encontrado.");
        }
        return userId;
    }
}
