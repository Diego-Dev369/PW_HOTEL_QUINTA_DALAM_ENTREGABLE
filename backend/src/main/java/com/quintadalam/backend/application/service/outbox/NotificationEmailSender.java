package com.quintadalam.backend.application.service.outbox;

import com.quintadalam.backend.common.error.BusinessException;
import com.quintadalam.backend.config.AppMailProperties;
import jakarta.mail.internet.MimeMessage;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class NotificationEmailSender {

    private final JavaMailSender mailSender;
    private final AppMailProperties appMailProperties;

    public NotificationEmailSender(JavaMailSender mailSender, AppMailProperties appMailProperties) {
        this.mailSender = mailSender;
        this.appMailProperties = appMailProperties;
    }

    public void sendHtml(String to, String subject, String htmlBody) {
        String from = appMailProperties.from();
        if (from == null || from.isBlank()) {
            throw new BusinessException(HttpStatus.INTERNAL_SERVER_ERROR, "MAIL_FROM_NOT_CONFIGURED", "MAIL_FROM no está configurado.");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception ex) {
            throw new BusinessException(HttpStatus.BAD_GATEWAY, "MAIL_DELIVERY_FAILED", "No fue posible entregar el correo.");
        }
    }
}
