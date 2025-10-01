package com.bloghive.notificationservice.consumer;

import com.bloghive.notificationservice.config.KafkaTopicConfig;
import com.bloghive.notificationservice.dtos.NotificationRequestDto;
import com.bloghive.notificationservice.services.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class NotificationConsumer {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ObjectMapper objectMapper;

    @KafkaListener(topics = {
            KafkaTopicConfig.COMMENT_TOPIC,
            KafkaTopicConfig.REPLY_TOPIC,
            KafkaTopicConfig.MENTION_TOPIC,
            KafkaTopicConfig.FOLLOW_TOPIC
    }, groupId = "notification_group")
    public void onMessage(String message) {
        try {
            NotificationRequestDto requestDto = objectMapper.readValue(message, NotificationRequestDto.class);
            notificationService.createNotification(requestDto);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
