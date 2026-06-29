package com.kihavie.backend.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OrderResponse {
    private Long id;
    private String orderNumber;
    private String userId;
    private String storeId;
    private String status;
    private BigDecimal totalAmount;
    private String shippingData;   // JSON string
    private String paymentMethod;
    private LocalDateTime createdAt;
}