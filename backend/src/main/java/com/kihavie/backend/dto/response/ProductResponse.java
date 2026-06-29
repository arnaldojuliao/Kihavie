package com.kihavie.backend.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private String category;
    private String storeId;
    private String[] images;
    private Boolean blocked;
    private LocalDateTime createdAt;
}