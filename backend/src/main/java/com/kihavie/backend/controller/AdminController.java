package com.kihavie.backend.controller;

import com.kihavie.backend.dto.request.ProductRequest;
import com.kihavie.backend.dto.response.ProductResponse;
import com.kihavie.backend.dto.response.StoreResponse;
import com.kihavie.backend.dto.response.UserResponse;
import com.kihavie.backend.service.AdminService;
import com.kihavie.backend.service.ProductService;
import com.kihavie.backend.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
    private final StoreService storeService;
    private final AdminService adminService;
    private final ProductService productService;

    @GetMapping("/stores")
    public ResponseEntity<List<StoreResponse>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @PatchMapping("/store/{storeId}/toggle-status")
    public ResponseEntity<Void> toggleStoreStatus(@PathVariable String storeId) {
        storeService.toggleStoreStatus(storeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/count")
    public ResponseEntity<Map<String, Long>> getUsersCount() {
        return ResponseEntity.ok(Map.of("count", adminService.getUsersCount()));
    }

    @PutMapping("/user/{userId}/make-admin")
    public ResponseEntity<UserResponse> makeUserAdmin(@PathVariable String userId) {
        UserResponse updatedUser = adminService.makeUserAdmin(userId);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/user/{userId}/role")
    public ResponseEntity<UserResponse> changeUserRole(@PathVariable String userId,
                                                       @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        if (newRole == null || newRole.isBlank()) {
            throw new RuntimeException("Role é obrigatório");
        }
        UserResponse updatedUser = adminService.changeUserRole(userId, newRole);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long productId,
                                                         @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(productId, request));
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        productService.adminDeleteProduct(productId);
        return ResponseEntity.noContent().build();
    }
    
    @PatchMapping("/products/{productId}/toggle-block")
    public ResponseEntity<ProductResponse> toggleBlockProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(productService.toggleBlockProduct(productId));
    }
    
    @GetMapping("/products")
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProductsForAdmin());
    }
}
