package com.kihavie.backend.service;

import com.kihavie.backend.dto.request.OrderRequest;
import com.kihavie.backend.dto.response.OrderResponse;
import com.kihavie.backend.entity.Order;
import com.kihavie.backend.entity.OrderItem;
import com.kihavie.backend.repository.OrderRepository;
import com.kihavie.backend.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    
    @Transactional
    public OrderResponse createOrder(String userId, OrderRequest request, String storeId) {
        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        BigDecimal total = request.getItems().stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUserId(userId);
        order.setStoreId(storeId);
        order.setTotalAmount(total);
        order.setShippingData(request.getShippingData());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setStatus("Processando");
        order.setCreatedAt(LocalDateTime.now());
        order = orderRepository.save(order);
        
        for (OrderRequest.OrderItemRequest itemReq : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrderId(order.getId());
            item.setProductId(itemReq.getProductId());
            item.setProductName(itemReq.getProductName());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            orderItemRepository.save(item);
        }
        return toResponse(order);
    }
    
    public List<OrderResponse> getOrdersByStore(String storeId) {
        return orderRepository.findByStoreId(storeId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }
    
    public BigDecimal getStoreRevenue(String storeId) {
    return orderRepository.sumTotalAmountByStoreId(storeId); // em vez de somar em memória
}
    
    private OrderResponse toResponse(Order order) {
        OrderResponse resp = new OrderResponse();
        resp.setId(order.getId());
        resp.setOrderNumber(order.getOrderNumber());
        resp.setUserId(order.getUserId());
        resp.setStoreId(order.getStoreId());
        resp.setStatus(order.getStatus());
        resp.setTotalAmount(order.getTotalAmount());
        resp.setShippingData(order.getShippingData());
        resp.setPaymentMethod(order.getPaymentMethod());
        resp.setCreatedAt(order.getCreatedAt());
        return resp;
    }
}