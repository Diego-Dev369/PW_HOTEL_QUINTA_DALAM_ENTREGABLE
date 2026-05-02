package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.ChangePasswordRequest;
import com.quintadalam.backend.application.dto.request.UserUpdateRequest;
import com.quintadalam.backend.application.dto.response.UserResponse;
import com.quintadalam.backend.application.mapper.UserMapper;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.enums.UserStatus;
import com.quintadalam.backend.domain.model.User;
import com.quintadalam.backend.domain.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream().map(userMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(UUID id) {
        User user = getUserEntity(id);
        return userMapper.toResponse(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserByEmail(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Usuario no encontrado."));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateUser(UUID id, UserUpdateRequest request) {
        User user = getUserEntity(id);
        userMapper.applyUpdate(user, request);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponse updateCurrentUserByEmail(String currentEmail, UserUpdateRequest request) {
        User user = userRepository.findByEmail(currentEmail.trim().toLowerCase())
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Usuario no encontrado."));

        String normalizedRequestedEmail = request.email().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(normalizedRequestedEmail) && userRepository.existsByEmail(normalizedRequestedEmail)) {
            throw new BusinessException(HttpStatus.CONFLICT, "USER_EMAIL_EXISTS", "El correo ya está registrado.");
        }

        userMapper.applyUpdate(user, request);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void changeCurrentUserPassword(String currentEmail, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(currentEmail.trim().toLowerCase())
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Usuario no encontrado."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BusinessException(HttpStatus.UNAUTHORIZED, "INVALID_CURRENT_PASSWORD", "La contraseña actual no es correcta.");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "PASSWORD_REUSE", "La nueva contraseña debe ser distinta.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void deactivateUser(UUID id) {
        User user = getUserEntity(id);
        user.setStatus(UserStatus.INACTIVE);
        user.setDeletedAt(java.time.Instant.now());
        userRepository.save(user);
    }

    private User getUserEntity(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Usuario no encontrado."));
    }
}
