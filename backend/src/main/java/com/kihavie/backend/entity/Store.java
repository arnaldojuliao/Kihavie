package com.kihavie.backend.entity;

import com.kihavie.backend.util.StoreIdGenerator;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "stores")
@Data
public class Store {
    @Id
    @GeneratedValue(generator = "store-id-gen")
    @GenericGenerator(name = "store-id-gen", type = StoreIdGenerator.class)
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    
    @Column(name = "zip_code")
    private String zipCode;
    
    private String status = "active";
    
    @Column(name = "owner_id", nullable = false, unique = true, length = 50)
    private String ownerId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}