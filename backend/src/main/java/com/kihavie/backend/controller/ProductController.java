package com.kihavie.backend.controller;

import com.kihavie.backend.dto.request.ProductRequest;
import com.kihavie.backend.dto.response.ProductResponse;
import com.kihavie.backend.service.ProductService;
import com.kihavie.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getActiveProducts() {
        return ResponseEntity.ok(productService.getActiveProducts());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ProductResponse>> getProductsByStore(@PathVariable String storeId) {
        return ResponseEntity.ok(productService.getProductsByStore(storeId));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody ProductRequest request,
                                                         @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String storeId = userPrincipal.getStoreId();
        if (storeId == null) {
            throw new RuntimeException("Usuário não possui loja");
        }
        return ResponseEntity.ok(productService.createProduct(request, storeId));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId,
                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String storeId = userPrincipal.getStoreId();
        if (storeId == null) {
            throw new RuntimeException("Usuário não possui loja");
        }
        productService.deleteProduct(productId, storeId);
        return ResponseEntity.noContent().build();
    }
}