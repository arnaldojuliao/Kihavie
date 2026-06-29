package com.kihavie.backend.repository;

import com.kihavie.backend.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface StoreRepository extends JpaRepository<Store, String> {
    Optional<Store> findByOwnerId(String ownerId);
    Optional<Store> findByIdAndStatus(String id, String status);
}