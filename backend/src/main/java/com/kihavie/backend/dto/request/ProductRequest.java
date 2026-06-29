package com.kihavie.backend.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private String sku;
    private String category;
    private String[] images; // array de URLs ou base64
}