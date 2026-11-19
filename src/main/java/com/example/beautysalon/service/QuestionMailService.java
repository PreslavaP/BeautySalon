package com.example.beautysalon.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class QuestionMailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendQuestionEmailAsync(
            String name,
            String email,
            String messageText,
            byte[] imageBytes,
            String attachmentName,
            String attachmentContentType) {

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

            if (imageBytes != null && imageBytes.length > 0 && attachmentName != null) {
                ByteArrayResource resource = new ByteArrayResource(imageBytes);
                helper.addAttachment(attachmentName, resource, attachmentContentType);
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }
}