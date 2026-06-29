package com.kihavie.backend.service;

import com.kihavie.backend.dto.response.UserResponse;
import com.kihavie.backend.entity.User;
import com.kihavie.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToUserResponse)
                .collect(Collectors.toList());
    }

    public long getUsersCount() {
        return userRepository.count();
    }

    @Transactional
    public UserResponse makeUserAdmin(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        user.setRole("admin");
        user = userRepository.save(user);
        return convertToUserResponse(user);
    }

    @Transactional
    public UserResponse changeUserRole(String userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado"));
        user.setRole(newRole);
        if ("storeOwner".equals(newRole)) {
            user.setCanCreateStore(true);
        }
        user = userRepository.save(user);
        return convertToUserResponse(user);
    }

    private UserResponse convertToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setRole(user.getRole());
        response.setCanCreateStore(user.getCanCreateStore());
        response.setStoreId(user.getStoreId());
        response.setProfileImage(user.getProfileImage());
        response.setCreatedAt(user.getCreatedAt());
        return response;
    }
}
