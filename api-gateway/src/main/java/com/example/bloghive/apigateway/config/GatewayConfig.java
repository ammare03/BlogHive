package com.example.bloghive.apigateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    
    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                // Auth Service Routes
                .route("auth-service", r -> r.path("/api/v1/auth/**")
                        .uri("lb://auth-service"))
                
                // Post Service Routes
                .route("post-service", r -> r.path("/api/v1/posts/**")
                        .uri("lb://post-service"))
                
                // Health check routes
                .route("eureka-service", r -> r.path("/eureka/**")
                        .uri("http://localhost:8761"))
                
                .build();
    }
}
