package com.kihavie.backend.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String name;
    
    @Email(message = "Email inválido")
    private String email;
    
    private String phone;
}