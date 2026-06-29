package com.kihavie.backend.entity;

import com.kihavie.backend.util.UserIdGenerator;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(generator = "user-id-gen")
    @GenericGenerator(name = "user-id-gen", type = UserIdGenerator.class)
    @Column(length = 50)
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    private String phone;
    
    @Column(name = "profile_image")
    private String profileImage;
    
    @Column(nullable = false)
    private String role = "client";
    
    @Column(name = "can_create_store")
    private Boolean canCreateStore = false;
    
    @Column(name = "store_id", length = 50)
    private String storeId;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}