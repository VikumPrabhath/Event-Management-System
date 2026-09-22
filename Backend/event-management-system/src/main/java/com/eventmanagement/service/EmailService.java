package com.eventmanagement.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public void sendBookingConfirmationWithQR(String to, String customerName, String eventTitle, String bookingId, String eventDate, String eventTime, String eventVenue, String tickets, String totalPaid, String eventImageUrl, byte[] qrCodeImage) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setFrom("sellout.support@gmail.com");
            helper.setSubject("Ticket Confirmation: " + eventTitle);
            
            Context context = new Context();
            context.setVariable("customerName", customerName);
            context.setVariable("eventTitle", eventTitle);
            context.setVariable("bookingId", bookingId);
            context.setVariable("eventDate", eventDate != null ? eventDate : "TBA");
            context.setVariable("eventTime", eventTime != null ? eventTime : "TBA");
            context.setVariable("eventVenue", eventVenue != null ? eventVenue : "TBA");
            context.setVariable("tickets", tickets);
            context.setVariable("totalPaid", totalPaid);
            context.setVariable("eventImageUrl", eventImageUrl);

            String htmlContent = templateEngine.process("booking-confirmation", context);
                    
            helper.setText(htmlContent, true);

            if (qrCodeImage != null) {
                helper.addAttachment("ticket-qr.png", new ByteArrayResource(qrCodeImage));
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }
}
