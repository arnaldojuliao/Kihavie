package com.kihavie.backend.service;

import com.kihavie.backend.dto.response.StoreResponse;
import com.kihavie.backend.dto.response.StoreStatsResponse;
import com.kihavie.backend.entity.Store;
import com.kihavie.backend.repository.OrderRepository;
import com.kihavie.backend.repository.ProductRepository;
import com.kihavie.backend.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    
    public List<StoreResponse> getAllStores() {
        return storeRepository.findAll().stream()
                .map(this::toResponse).collect(Collectors.toList());
    }
    
    public StoreResponse getStoreById(String id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));
        return toResponse(store);
    }

    @Transactional
    public StoreStatsResponse getStoreStats(String storeId) {
        // Verifica se a loja existe
        if (!storeRepository.existsById(storeId)) {
            throw new RuntimeException("Loja não encontrada com ID: " + storeId);
        }

        long totalProducts = productRepository.countByStoreId(storeId);
        long totalOrders = orderRepository.countByStoreId(storeId);
        BigDecimal totalRevenue = orderRepository.sumTotalAmountByStoreId(storeId);

        return new StoreStatsResponse(storeId, totalProducts, totalOrders, totalRevenue);
    }
    
   @Transactional
    public StoreResponse updateStore(String id, Store updates) {
    Store store = storeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Loja não encontrada"));
    if (updates.getName() != null) store.setName(updates.getName());
    if (updates.getDescription() != null) store.setDescription(updates.getDescription());
    if (updates.getEmail() != null) store.setEmail(updates.getEmail());
    if (updates.getPhone() != null) store.setPhone(updates.getPhone());
    if (updates.getAddress() != null) store.setAddress(updates.getAddress());
    if (updates.getCity() != null) store.setCity(updates.getCity());
    if (updates.getState() != null) store.setState(updates.getState());
    if (updates.getZipCode() != null) store.setZipCode(updates.getZipCode());
    // status e ownerId não devem ser alterados por update comum
    store = storeRepository.save(store);
    return toResponse(store);
    }

    @Transactional
    public void toggleStoreStatus(String storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));
        store.setStatus(store.getStatus().equals("active") ? "suspended" : "active");
        storeRepository.save(store);
    }
    
    public Store getStoreEntityById(String storeId) {
        return storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Loja não encontrada"));
    }
    
    private StoreResponse toResponse(Store s) {
        StoreResponse resp = new StoreResponse();
        resp.setId(s.getId());
        resp.setName(s.getName());
        resp.setDescription(s.getDescription());
        resp.setEmail(s.getEmail());
        resp.setPhone(s.getPhone());
        resp.setAddress(s.getAddress());
        resp.setCity(s.getCity());
        resp.setState(s.getState());
        resp.setZipCode(s.getZipCode());
        resp.setStatus(s.getStatus());
        resp.setOwnerId(s.getOwnerId());
        resp.setCreatedAt(s.getCreatedAt());
        return resp;
    }
}