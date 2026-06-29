package com.kihavie.backend.service;

import com.kihavie.backend.dto.request.ProductRequest;
import com.kihavie.backend.dto.response.ProductResponse;
import com.kihavie.backend.entity.Product;
import com.kihavie.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    // Lista apenas produtos de lojas ativas (consulta otimizada no banco)
    public List<ProductResponse> getActiveProducts() {
        return productRepository.findActiveProducts()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByStore(String storeId) {
        return productRepository.findByStoreId(storeId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request, String storeId) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setSku(request.getSku());
        product.setCategory(request.getCategory());
        product.setStoreId(storeId);
        product.setImages(request.getImages());
        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public void deleteProduct(Long productId, String storeId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        if (!product.getStoreId().equals(storeId)) {
            throw new RuntimeException("Não autorizado");
        }
        productRepository.delete(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getSku() != null) product.setSku(request.getSku());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getImages() != null) product.setImages(request.getImages());
        product = productRepository.save(product);
        return toResponse(product);
    }

    @Transactional
    public void adminDeleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        productRepository.delete(product);
    }
    
    @Transactional
    public ProductResponse toggleBlockProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        product.setBlocked(!Boolean.TRUE.equals(product.getBlocked()));
        product = productRepository.save(product);
        return toResponse(product);
    }

    private ProductResponse toResponse(Product p) {
        ProductResponse resp = new ProductResponse();
        resp.setId(p.getId());
        resp.setName(p.getName());
        resp.setDescription(p.getDescription());
        resp.setPrice(p.getPrice());
        resp.setStock(p.getStock());
        resp.setSku(p.getSku());
        resp.setCategory(p.getCategory());
        resp.setStoreId(p.getStoreId());
        resp.setImages(p.getImages());
        resp.setBlocked(p.getBlocked());
        resp.setCreatedAt(p.getCreatedAt());
        return resp;
    }
}