// src/main/java/com/kihavie/backend/dto/response/StoreStatsResponse.java
package com.kihavie.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StoreStatsResponse {
    private String storeId;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
}