package com.kihavie.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Boolean canCreateStore;
    private String storeId;
    private String profileImage;
    private LocalDateTime createdAt;
}