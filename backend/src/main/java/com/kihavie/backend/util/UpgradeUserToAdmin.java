// Ficheiro: src/main/java/com/kihavie/backend/util/UpgradeUserToAdmin.java
package com.kihavie.backend.util;

import com.kihavie.backend.entity.User;
import com.kihavie.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

// @Component // Descomente para executar e depois comente novamente
public class UpgradeUserToAdmin implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        String userEmail = "email_do_usuario@exemplo.com"; // Altere para o email desejado
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Utilizador não encontrado: " + userEmail));
        user.setRole("admin");
        userRepository.save(user);
        System.out.println("Utilizador " + userEmail + " foi promovido a ADMIN.");
    }
}