package com.example.bloghive.postservice.service;

import com.example.bloghive.postservice.dto.AuthRequest;
import com.example.bloghive.postservice.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class AuthValidationService {

    @Autowired
    private RestTemplate restTemplate;

    private static final String AUTH_SERVICE_VALIDATE_URL = "http://localhost:8085/api/v1/auth/validate";

    public User validateCredentials(AuthRequest authRequest) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            HttpEntity<AuthRequest> entity = new HttpEntity<>(authRequest, headers);

            ResponseEntity<User> response = restTemplate.exchange(
                    AUTH_SERVICE_VALIDATE_URL,
                    HttpMethod.POST,
                    entity,
                    User.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        } catch (HttpClientErrorException.Unauthorized e) {
            throw new RuntimeException("Invalid credentials");
        } catch (Exception e) {
            throw new RuntimeException("Authentication service unavailable: " + e.getMessage());
        }
    }
}