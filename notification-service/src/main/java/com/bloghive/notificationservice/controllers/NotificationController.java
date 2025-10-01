package com.bloghive.notificationservice.controllers;

import com.bloghive.notificationservice.dtos.NotificationRequestDto;
import com.bloghive.notificationservice.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @PostMapping
    public ResponseEntity<String> sendTestNotification(@RequestBody NotificationRequestDto requestDto) {
        notificationService.createNotification(requestDto);
        return ResponseEntity.ok("Test notification sent successfully.");
    }
}
