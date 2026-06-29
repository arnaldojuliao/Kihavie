package com.kihavie.backend.repository;

import com.kihavie.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(String userId);
    List<Order> findByStoreId(String storeId);
    long countByStoreId(String storeId);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.storeId = :storeId")
    BigDecimal sumTotalAmountByStoreId(@Param("storeId") String storeId);
}