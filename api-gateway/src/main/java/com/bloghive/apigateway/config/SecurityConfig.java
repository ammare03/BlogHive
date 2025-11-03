package com.bloghive.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
// import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;

@Configuration
@EnableWebFluxSecurity // Use @EnableWebFluxSecurity for reactive (Gateway)
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // --- THIS IS THE FIX ---
                // Disable CSRF for the gateway.
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                // ---------------------

                // Allow all requests to pass through the gateway
                // Security will be handled by the downstream services
                .authorizeExchange(exchange -> exchange
                        .pathMatchers("/**").permitAll())
                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable); // Disable HTTP Basic auth

        return http.build();
    }
}