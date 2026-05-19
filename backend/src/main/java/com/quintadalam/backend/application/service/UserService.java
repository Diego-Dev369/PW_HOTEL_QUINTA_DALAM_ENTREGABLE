package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.ChangePasswordRequest;
import com.quintadalam.backend.application.dto.request.UserCreateRequest;
import com.quintadalam.backend.application.dto.request.UserUpdateRequest;
import com.quintadalam.backend.application.dto.response.UserResponse;
import com.quintadalam.backend.application.mapper.UserMapper;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.enums.UserStatus;
import com.quintadalam.backend.domain.model.Role;
import com.quintadalam.backend.domain.model.User;
import com.quintadalam.backend.domain.repository.RoleRepository;
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
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAllIncludingDeleted().stream().map(userMapper::toResponse).toList();
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
    public UserResponse createUser(UserCreateRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BusinessException(HttpStatus.CONFLICT, "USER_EMAIL_EXISTS", "El correo ya esta registrado.");
        }

        String roleCode = (request.role() == null || request.role().isBlank()) ? "GUEST" : request.role().trim().toUpperCase();
        Role role = roleRepository.findByCode(roleCode)
            .orElseThrow(() -> new BusinessException(HttpStatus.BAD_REQUEST, "ROLE_NOT_FOUND", "Rol no encontrado."));

        User user = new User();
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhone(request.phone() == null || request.phone().isBlank() ? null : request.phone().trim());
        user.setStatus(UserStatus.ACTIVE);
        user.getRoles().add(role);

        return userMapper.toResponse(userRepository.save(user));
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
        user.setDeletedAt(null);
        userRepository.save(user);
    }

    @Transactional
    public UserResponse activateUser(UUID id) {
        User user = userRepository.findByIdIncludingDeleted(id.toString())
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Usuario no encontrado."));
        user.setStatus(UserStatus.ACTIVE);
        user.setDeletedAt(null);
        return userMapper.toResponse(userRepository.save(user));
    }

    private User getUserEntity(UUID id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "Usuario no encontrado."));
    }
}
