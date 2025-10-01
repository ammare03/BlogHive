package com.bloghive.notificationservice.services;

import com.bloghive.notificationservice.dtos.NotificationRequestDto;
import com.bloghive.notificationservice.models.Notification;
import com.bloghive.notificationservice.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
                .isRead(false)
                .build();
        notificationRepository.save(notification);

        emailService.sendEmail("engineer.ammar18724@gmail.com", "New Notification", requestDto.getMessage());
    }
}
