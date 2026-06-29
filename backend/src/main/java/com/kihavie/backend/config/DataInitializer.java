// Ficheiro: src/main/java/com/kihavie/backend/config/DataInitializer.java
package com.kihavie.backend.config;

import com.kihavie.backend.entity.User;
import com.kihavie.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setName("Administrador");
            admin.setEmail("admin@admin.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("admin");
            admin.setCanCreateStore(true);
            userRepository.save(admin);
            System.out.println("Administrador criado com sucesso!");
        } else {
            System.out.println("Já existem usuários no sistema.");
        }
    }
}