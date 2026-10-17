package com.example.beautysalon.controller;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

@Controller
public class QuestionController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send-question")
    public String sendQuestion(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("message") String messageText,
            @RequestParam(value = "image", required = false) MultipartFile image) {

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("aesthetinformation@gmail.com");
            helper.setTo("aesthetinformation@gmail.com");
            helper.setReplyTo(email);
            helper.setSubject("BeautySalonQuestionForm: " + name);

            String body = "Име: " + name + "\n" +
                    "Имейл: " + email + "\n\n" +
                    "Въпрос:\n" + messageText;

            helper.setText(body);

            if (image != null && !image.isEmpty()) {
                helper.addAttachment(image.getOriginalFilename(), image);
            }

            mailSender.send(message);

        } catch (MessagingException e) {
            e.printStackTrace();
            return "redirect:/#about?error";
        }

        return "redirect:/#about?success";
    }
}