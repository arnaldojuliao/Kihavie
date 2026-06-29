package com.kihavie.backend.repository;

import com.kihavie.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByStoreId(String storeId);
    List<Product> findByStoreIdIn(List<String> storeIds);
    
    @Query("SELECT p FROM Product p WHERE p.storeId IN (SELECT s.id FROM Store s WHERE s.status = 'active')")
    List<Product> findActiveProducts();

    long countByStoreId(String storeId);
}