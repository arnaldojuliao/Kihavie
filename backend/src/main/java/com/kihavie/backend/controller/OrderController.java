package com.kihavie.backend.controller;

import com.kihavie.backend.dto.request.OrderRequest;
import com.kihavie.backend.dto.response.OrderResponse;
import com.kihavie.backend.service.OrderService;
import com.kihavie.backend.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request,
                                                     @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String userId = userPrincipal.getId();
        // Extrai storeId do primeiro item do pedido (assumindo que todos itens são da mesma loja)
        String storeId = request.getItems().isEmpty() ? null : request.getItems().get(0).getStoreId();
        if (storeId == null) {
            throw new RuntimeException("Nenhuma loja identificada no pedido");
        }
        return ResponseEntity.ok(orderService.createOrder(userId, request, storeId));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<OrderResponse>> getStoreOrders(@PathVariable String storeId,
                                                              @AuthenticationPrincipal UserPrincipal userPrincipal) {
        // Verificar se o usuário é dono da loja ou admin (pode ser feito em service)
        return ResponseEntity.ok(orderService.getOrdersByStore(storeId));
    }

    @GetMapping("/store/revenue")
    public ResponseEntity<BigDecimal> getStoreRevenue(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        String storeId = userPrincipal.getStoreId();
        if (storeId == null) {
            throw new RuntimeException("Usuário não possui loja");
        }
        return ResponseEntity.ok(orderService.getStoreRevenue(storeId));
    }
}