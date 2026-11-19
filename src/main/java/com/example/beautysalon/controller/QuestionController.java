package com.example.beautysalon.controller;

import com.example.beautysalon.service.QuestionMailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Set;
import java.util.UUID;

@Controller
public class QuestionController {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_IMAGE_SIZE = 5L * 1024 * 1024; // 5 MB

    @Autowired
    private QuestionMailService questionMailService;

    @PostMapping("/send-question")
    public ResponseEntity<String> sendQuestion(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("message") String messageText,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            byte[] imageBytes = null;
            String attachmentName = null;
            String attachmentContentType = null;

            if (image != null && !image.isEmpty()) {
                ValidatedImage validated = validateImage(image);
                imageBytes = validated.bytes();
                attachmentName = validated.safeName();
                attachmentContentType = validated.contentType();
            }

            questionMailService.sendQuestionEmailAsync(
                    name, email, messageText, imageBytes, attachmentName, attachmentContentType
            );

            return ResponseEntity.ok("OK");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Грешка при обработка на снимката.");
        }
    }

    private ValidatedImage validateImage(MultipartFile image) throws IOException {
        if (image.getSize() > MAX_IMAGE_SIZE) {
            throw new IllegalArgumentException("Снимката не трябва да надвишава 5 MB.");
        }

        String contentType = image.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Позволени са само снимки (JPG, JPEG, PNG, WEBP, GIF).");
        }

        byte[] bytes = image.getBytes();
        String lowerType = contentType.toLowerCase();

        if (!"image/webp".equals(lowerType)) {
            BufferedImage bufferedImage = ImageIO.read(new ByteArrayInputStream(bytes));
            if (bufferedImage == null) {
                throw new IllegalArgumentException("Файлът не е валидна снимка.");
            }
        }

        String extension = switch (lowerType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };

        String safeName = "question-" + UUID.randomUUID() + extension;
        return new ValidatedImage(bytes, safeName, lowerType);
    }

    private record ValidatedImage(byte[] bytes, String safeName, String contentType) {
    }
}