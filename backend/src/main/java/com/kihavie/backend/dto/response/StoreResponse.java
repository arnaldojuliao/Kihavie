package com.kihavie.backend.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StoreResponse {
    private String id;
    private String name;
    private String description;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String status;
    private String ownerId;
    private LocalDateTime createdAt;
}