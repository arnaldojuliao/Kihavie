package com.kihavie.backend.dto.request;

import lombok.Data;
import java.util.List;
import java.math.BigDecimal;

@Data
public class OrderRequest {
    private List<OrderItemRequest> items;
    private String shippingData; // JSON
    private String paymentMethod;
    
    @Data
    public static class OrderItemRequest {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal unitPrice;
        private String storeId; 
    }
}