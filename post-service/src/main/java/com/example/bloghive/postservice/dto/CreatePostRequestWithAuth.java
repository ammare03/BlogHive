package com.example.bloghive.postservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;

public class CreatePostRequestWithAuth {

    @Valid
    private AuthRequest auth;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String excerpt;

    // Constructors
    public CreatePostRequestWithAuth() {
    }

    // Getters and Setters
    public AuthRequest getAuth() {
        return auth;
    }

    public void setAuth(AuthRequest auth) {
        this.auth = auth;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getExcerpt() {
        return excerpt;
    }

    public void setExcerpt(String excerpt) {
        this.excerpt = excerpt;
    }
}