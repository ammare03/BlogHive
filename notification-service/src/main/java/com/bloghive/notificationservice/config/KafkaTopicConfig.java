package com.bloghive.notificationservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String COMMENT_TOPIC = "comment_notification";
    public static final String REPLY_TOPIC = "reply_notification";
    public static final String MENTION_TOPIC = "mention_notification";
    public static final String FOLLOW_TOPIC = "follow_notification";

    @Bean
    public NewTopic commentTopic() {
        return TopicBuilder.name(COMMENT_TOPIC).build();
    }

    @Bean
    public NewTopic replyTopic() {
        return TopicBuilder.name(REPLY_TOPIC).build();
    }

    @Bean
    public NewTopic mentionTopic() {
        return TopicBuilder.name(MENTION_TOPIC).build();
    }

    @Bean
    public NewTopic followTopic() {
        return TopicBuilder.name(FOLLOW_TOPIC).build();
    }
}
