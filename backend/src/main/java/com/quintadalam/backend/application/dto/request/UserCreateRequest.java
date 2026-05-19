package com.quintadalam.backend.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserCreateRequest(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8, max = 72) String password,
    @NotBlank String firstName,
    @NotBlank String lastName,
    String phone,
    @Pattern(regexp = "ADMIN|RECEPTION|GUEST", message = "Rol invalido. Usa ADMIN, RECEPTION o GUEST.") String role
) {
}