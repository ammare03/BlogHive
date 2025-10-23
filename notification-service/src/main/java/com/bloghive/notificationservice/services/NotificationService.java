package com.bloghive.notificationservice.services;

import com.bloghive.notificationservice.dtos.NotificationRequestDto;
import com.bloghive.notificationservice.models.Notification;
import com.bloghive.notificationservice.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils; // Import StringUtils

import java.time.LocalDateTime;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EmailService emailService;

    public void createNotification(NotificationRequestDto requestDto) {
        Notification notification = Notification.builder()
                .userId(requestDto.getUserId())
                .message(requestDto.getMessage())
                .timestamp(LocalDateTime.now())
                .readStatus(false)
                .build();
        notificationRepository.save(notification);

        // --- FIX ---
        // Use the userEmail from the DTO if it's provided
        if (StringUtils.hasText(requestDto.getUserEmail())) {
            emailService.sendEmail(requestDto.getUserEmail(), "New Notification from BlogHive", requestDto.getMessage());
        } else {
            // Optional: Log a warning if email is missing, or handle as needed
            System.err.println("Warning: userEmail not provided in NotificationRequestDto for userId: " + requestDto.getUserId());
            // You might still want to send to a default admin email for monitoring, or skip sending.
            // Example: emailService.sendEmail("admin@example.com", "Missing User Email Notification", "Notification for userId " + requestDto.getUserId() + " lacked an email address. Message: " + requestDto.getMessage());
        }
        // -----------
    }
}