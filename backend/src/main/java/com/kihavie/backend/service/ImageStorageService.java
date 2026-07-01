package com.kihavie.backend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import java.util.Base64;
import java.util.Map;

@Service
public class ImageStorageService {

    private final Cloudinary cloudinary;

    public ImageStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String saveProfileImage(String userId, String base64Data) {
        return saveImage("profiles", userId, base64Data);
    }

    public String saveProductImage(String productId, String base64Data) {
        return saveImage("products", productId, base64Data);
    }

    private String saveImage(String folder, String id, String base64Data) {
        try {
            // Remove o prefixo do base64 se existir (ex: "data:image/png;base64,")
            String base64Body = base64Data;
            if (base64Data.contains(",")) {
                base64Body = base64Data.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Body);

            // Determine a public_id a partir do folder + id
            String publicId = folder + "/" + id + "_" + System.currentTimeMillis();

            // Faz upload para o Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(imageBytes, ObjectUtils.asMap(
                "public_id", publicId,
                "overwrite", true
            ));

            // Retorna a URL segura (HTTPS) da imagem
            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao fazer upload para Cloudinary: " + e.getMessage(), e);
        }
    }
}