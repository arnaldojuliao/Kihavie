// src/main/java/com/kihavie/backend/controller/StoreController.java
package com.kihavie.backend.controller;

import com.kihavie.backend.dto.response.StoreResponse;
import com.kihavie.backend.dto.response.StoreStatsResponse;
import com.kihavie.backend.entity.Store;
import com.kihavie.backend.security.UserPrincipal;
import com.kihavie.backend.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;

    @GetMapping
    public ResponseEntity<List<StoreResponse>> getActiveStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<StoreResponse> getStoreById(@PathVariable String storeId) {
        return ResponseEntity.ok(storeService.getStoreById(storeId));
    }

    @GetMapping("/{storeId}/stats")
    public ResponseEntity<StoreStatsResponse> getStoreStats(@PathVariable String storeId) {
        return ResponseEntity.ok(storeService.getStoreStats(storeId));
    }

    @PutMapping("/{storeId}")
    public ResponseEntity<StoreResponse> updateStore(@PathVariable String storeId,
                                                     @RequestBody Store storeData,
                                                     @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Store store = storeService.getStoreEntityById(storeId);
        if (!store.getOwnerId().equals(userPrincipal.getId()) && !userPrincipal.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            throw new RuntimeException("Não autorizado");
        }
        return ResponseEntity.ok(storeService.updateStore(storeId, storeData));
    }
}