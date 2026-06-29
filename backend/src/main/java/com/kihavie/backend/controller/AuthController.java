package com.kihavie.backend.controller;

import com.kihavie.backend.dto.request.LoginRequest;
import com.kihavie.backend.dto.request.RegisterRequest;
import com.kihavie.backend.dto.request.UpdateProfileRequest;
import com.kihavie.backend.dto.response.UserResponse;
import com.kihavie.backend.service.AuthService;
import com.kihavie.backend.service.ImageStorageService;
import com.kihavie.backend.config.JwtUtil;
import com.kihavie.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final ImageStorageService imageStorageService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.login(request);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse user = authService.register(request);
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(Map.of("user", user, "token", token));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = new UserResponse();
        response.setId(userPrincipal.getId());
        response.setName(userPrincipal.getName());
        response.setEmail(userPrincipal.getUsername());
        response.setPhone(userPrincipal.getPhone());
        response.setRole(userPrincipal.getRole());
        response.setStoreId(userPrincipal.getStoreId());
        response.setProfileImage(userPrincipal.getProfileImage());
        response.setCanCreateStore(userPrincipal.getStoreId() != null);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upgrade-to-store")
    public ResponseEntity<?> upgradeToStore(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse updated = authService.upgradeToStoreOwner(userPrincipal.getId());
        String token = jwtUtil.generateToken(updated.getId(), updated.getEmail(), updated.getRole());
        return ResponseEntity.ok(Map.of("user", updated, "token", token));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                      @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(userPrincipal.getId(), request));
    }

    @PutMapping("/profile-image")
    public ResponseEntity<?> updateProfileImage(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                @RequestBody Map<String, String> body) {
        String imageBase64 = body.get("image");
        String imageUrl = imageStorageService.saveProfileImage(userPrincipal.getId(), imageBase64);
        UserResponse updated = authService.updateProfileImage(userPrincipal.getId(), imageUrl);
        return ResponseEntity.ok(Map.of("profileImage", imageUrl, "user", updated));
    }
}