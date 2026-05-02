package com.quintadalam.backend.application.service;

import com.quintadalam.backend.application.dto.request.LoginRequest;
import com.quintadalam.backend.application.dto.request.RegisterRequest;
import com.quintadalam.backend.application.dto.response.AuthResponse;
import com.quintadalam.backend.application.mapper.UserMapper;
import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.domain.model.Role;
import com.quintadalam.backend.domain.model.User;
import com.quintadalam.backend.domain.repository.RoleRepository;
import com.quintadalam.backend.domain.repository.UserRepository;
import com.quintadalam.backend.security.JwtProperties;
import com.quintadalam.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final JwtProperties jwtProperties;

    public AuthService(
        UserRepository userRepository,
        RoleRepository roleRepository,
        UserMapper userMapper,
        PasswordEncoder passwordEncoder,
        AuthenticationManager authenticationManager,
        JwtService jwtService,
        JwtProperties jwtProperties
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.jwtProperties = jwtProperties;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BusinessException(HttpStatus.CONFLICT, "USER_EMAIL_EXISTS", "El correo ya está registrado.");
        }

        User user = userMapper.toUser(request, passwordEncoder);
        Role guestRole = roleRepository.findByCode("GUEST")
            .orElseThrow(() -> new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "ROLE_NOT_FOUND", "No existe el rol GUEST."));

        user.getRoles().add(guestRole);
        User saved = userRepository.save(user);

        UserDetails principal = org.springframework.security.core.userdetails.User.builder()
            .username(saved.getEmail())
            .password(saved.getPasswordHash())
            .authorities(saved.getRoles().stream().map(r -> "ROLE_" + r.getCode()).toArray(String[]::new))
            .build();

        String token = jwtService.generateAccessToken(principal);

        return new AuthResponse(
            saved.getId(),
            saved.getEmail(),
            saved.getRoles().stream().map(Role::getCode).toList(),
            token,
            "Bearer",
            jwtProperties.jwtExpirationSeconds()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email().trim().toLowerCase(), request.password())
        );

        UserDetails principal = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername())
            .orElseThrow(() -> new BusinessException(HttpStatus.UNAUTHORIZED, "AUTH_USER_NOT_FOUND", "Usuario no encontrado."));

        String token = jwtService.generateAccessToken(principal);

        return new AuthResponse(
            user.getId(),
            user.getEmail(),
            user.getRoles().stream().map(Role::getCode).toList(),
            token,
            "Bearer",
            jwtProperties.jwtExpirationSeconds()
        );
    }
}
