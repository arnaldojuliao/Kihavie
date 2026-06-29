package com.kihavie.backend.service;

import com.kihavie.backend.dto.request.LoginRequest;
import com.kihavie.backend.dto.request.RegisterRequest;
import com.kihavie.backend.dto.request.UpdateProfileRequest;
import com.kihavie.backend.dto.response.UserResponse;
import com.kihavie.backend.entity.User;
import com.kihavie.backend.entity.Store;
import com.kihavie.backend.repository.UserRepository;
import com.kihavie.backend.repository.StoreRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.kihavie.backend.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Email ou senha inválidos"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Email ou senha inválidos");
        }
        return jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(request.getRole() != null ? request.getRole() : "client");
        user.setCanCreateStore(false);
        user = userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse upgradeToStoreOwner(String userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (user.getStoreId() != null) {
            throw new RuntimeException("Usuário já possui loja");
        }
        // Simula pagamento de MT 500,00
        Store store = new Store();
        store.setName("Loja de " + user.getName());
        store.setOwnerId(user.getId());
        store.setStatus("active");
        store = storeRepository.save(store);
        user.setRole("storeOwner");
        user.setCanCreateStore(true);
        user.setStoreId(store.getId());
        user = userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (request.getName() != null) user.setName(request.getName());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        user = userRepository.save(user);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfileImage(String userId, String imageUrl) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        user.setProfileImage(imageUrl);
        user = userRepository.save(user);
        return toUserResponse(user);
    }

    private UserResponse toUserResponse(User user) {
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setPhone(user.getPhone());
        resp.setRole(user.getRole());
        resp.setCanCreateStore(user.getCanCreateStore());
        resp.setStoreId(user.getStoreId());
        resp.setProfileImage(user.getProfileImage());
        resp.setCreatedAt(user.getCreatedAt());
        return resp;
    }
}