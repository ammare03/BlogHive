package com.example.bloghive.postservice.dto;

import jakarta.validation.Valid;

public class DeletePostRequestWithAuth {

    @Valid
    private AuthRequest auth;

    // Constructors
    public DeletePostRequestWithAuth() {
    }

    // Getters and Setters
    public AuthRequest getAuth() {
        return auth;
    }

    public void setAuth(AuthRequest auth) {
        this.auth = auth;
    }
}