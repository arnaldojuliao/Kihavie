package com.kihavie.backend.security;

import com.kihavie.backend.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {
    private final String id;
    private final String email;
    private final String password;
    private final String role;
    private final String storeId;        // loja que o usuário possui (se for storeOwner)
    private final String name;
    private final String phone;
    private final String profileImage;

    public UserPrincipal(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
        this.storeId = user.getStoreId();
        this.name = user.getName();
        this.phone = user.getPhone();
        this.profileImage = user.getProfileImage();
    }

    public String getId() { return id; }
    public String getStoreId() { return storeId; }
    public String getRole() { return role; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getProfileImage() { return profileImage; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // A role deve ser precedida de "ROLE_" para o Spring Security
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return email; }   // Spring usa o email como username

    @Override
    public boolean isAccountNonExpired() { return true; }
    @Override
    public boolean isAccountNonLocked() { return true; }
    @Override
    public boolean isCredentialsNonExpired() { return true; }
    @Override
    public boolean isEnabled() { return true; }
}