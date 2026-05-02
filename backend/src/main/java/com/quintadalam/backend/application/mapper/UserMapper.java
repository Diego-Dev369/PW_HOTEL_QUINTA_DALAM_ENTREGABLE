package com.quintadalam.backend.application.mapper;

import com.quintadalam.backend.application.dto.request.RegisterRequest;
import com.quintadalam.backend.application.dto.request.UserUpdateRequest;
import com.quintadalam.backend.application.dto.response.UserResponse;
import com.quintadalam.backend.domain.enums.UserStatus;
import com.quintadalam.backend.domain.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toUser(RegisterRequest request, PasswordEncoder passwordEncoder) {
        User user = new User();
        user.setEmail(request.email().trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhone(request.phone());
        user.setStatus(UserStatus.ACTIVE);
        return user;
    }

    public void applyUpdate(User user, UserUpdateRequest request) {
        user.setEmail(request.email().trim().toLowerCase());
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhone(request.phone());
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getEmail(),
            user.getFirstName(),
            user.getLastName(),
            user.getPhone(),
            user.getStatus().name(),
            user.getRoles().stream().map(r -> r.getCode()).toList()
        );
    }
}
