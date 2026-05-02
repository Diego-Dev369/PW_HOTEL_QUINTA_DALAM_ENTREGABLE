package com.quintadalam.backend.api.controller;

import com.quintadalam.backend.application.dto.request.ChangePasswordRequest;
import com.quintadalam.backend.application.dto.request.UserUpdateRequest;
import com.quintadalam.backend.application.dto.response.UserResponse;
import com.quintadalam.backend.application.service.UserService;
import com.quintadalam.backend.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> me(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok(userService.getCurrentUserByEmail(authentication.getName())));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMe(
        @Valid @RequestBody UserUpdateRequest request,
        Authentication authentication
    ) {
        return ResponseEntity.ok(ApiResponse.ok(userService.updateCurrentUserByEmail(authentication.getName(), request)));
    }

    @PutMapping("/me/password")
    public ResponseEntity<ApiResponse<String>> updatePassword(
        @Valid @RequestBody ChangePasswordRequest request,
        Authentication authentication
    ) {
        userService.changeCurrentUserPassword(authentication.getName(), request);
        return ResponseEntity.ok(ApiResponse.ok("Contraseña actualizada correctamente."));
    }
}
