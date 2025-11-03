package com.bloghive.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebFluxSecurity // This MUST be @EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(ServerHttpSecurity.CsrfSpec::disable) // This disables CSRF
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/**").permitAll())
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // --- THIS IS THE LIKELY PROBLEM ---
        // Let's add your API Gateway URL to the allowed origins, just in case
        corsConfig.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://a4b8b3dcb0db84537afaad462e4a4798-796492693.us-east-1.elb.amazonaws.com:3000",
                "http://a46b83203b8934d95acfa0263b23040e-140158648.us-east-1.elb.amazonaws.com" // Add the API gateway
                                                                                                // itself
        ));

        // --- THIS IS THE LIKELY FIX ---
        // You are allowing "Content-Type" but maybe not "Content-type" or other
        // variations.
        // Let's explicitly allow all common headers.
        corsConfig.setAllowedHeaders(
                Arrays.asList("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));

        corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        corsConfig.setAllowCredentials(true);
        corsConfig.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return source;
    }
}