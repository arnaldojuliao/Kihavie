package com.kihavie.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.UUID;

@Service
public class ImageStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveProfileImage(String userId, String base64Data) {
        return saveImage("profiles", userId, base64Data);
    }

    public String saveProductImage(Long productId, String base64Data) {
        return saveImage("products", productId.toString(), base64Data);
    }

    private String saveImage(String folder, String id, String base64Data) {
        try {
            Path uploadPath = Paths.get(uploadDir, folder);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Detecta extensão da imagem
            String extension = "jpg";
            if (base64Data.contains("data:image/png")) {
                extension = "png";
            } else if (base64Data.contains("data:image/jpeg")) {
                extension = "jpg";
            } else if (base64Data.contains("data:image/webp")) {
                extension = "webp";
            }

            // Remove o prefixo do base64 se existir
            String base64Body = base64Data;
            if (base64Data.contains(",")) {
                base64Body = base64Data.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Body);
            String fileName = id + "_" + UUID.randomUUID().toString().substring(0, 8) + "." + extension;
            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, imageBytes);

            // Retorna URL relativa (ex: "/uploads/profiles/123_abc.jpg")
            return "/uploads/" + folder + "/" + fileName;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao salvar imagem: " + e.getMessage(), e);
        }
    }
}