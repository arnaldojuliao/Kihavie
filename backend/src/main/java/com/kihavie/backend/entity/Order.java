package com.kihavie.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;
    
    @Column(name = "user_id", nullable = false, length = 50)
    private String userId;
    
    @Column(name = "store_id", nullable = false, length = 50)
    private String storeId;
    
    private String status = "Processando";
    
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;
    
    @Column(name = "shipping_data", columnDefinition = "JSONB", nullable = false)
    private String shippingData; // armazena JSON como String
    
    @Column(name = "payment_method")
    private String paymentMethod;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}