package com.bloghive.notificationservice.mappers;

import com.bloghive.notificationservice.dtos.NotificationDto;
import com.bloghive.notificationservice.models.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    NotificationDto toDto(Notification notification);
    Notification toEntity(NotificationDto notificationDto);
}
