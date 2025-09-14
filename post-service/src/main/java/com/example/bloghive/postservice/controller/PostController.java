package com.example.bloghive.postservice.controller;

import com.example.bloghive.postservice.dto.*;
import com.example.bloghive.postservice.model.User;
import com.example.bloghive.postservice.service.AuthValidationService;
import com.example.bloghive.postservice.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private AuthValidationService authValidationService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequestWithAuth request) {
        try {
            // Validate credentials with auth service
            User user = authValidationService.validateCredentials(request.getAuth());

            // Create the actual post request
            CreatePostRequest createRequest = new CreatePostRequest();
            createRequest.setTitle(request.getTitle());
            createRequest.setContent(request.getContent());
            createRequest.setExcerpt(request.getExcerpt());

            PostResponse response = postService.createPost(createRequest, user.getId(), user.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        try {
            PostResponse response = postService.getPostById(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<PostResponse> getPostBySlug(@PathVariable String slug) {
        try {
            PostResponse response = postService.getPostBySlug(slug);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<PostResponse> posts = postService.getAllPosts(page, size, sortBy, sortDirection);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<Page<PostResponse>> getPostsByAuthor(
            @PathVariable Long authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<PostResponse> posts = postService.getPostsByAuthor(authorId, page, size);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostResponse>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<PostResponse> posts = postService.searchPosts(keyword, page, size);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePostRequestWithAuth request) {
        try {
            // Validate credentials with auth service
            User user = authValidationService.validateCredentials(request.getAuth());

            // Create the actual update request
            UpdatePostRequest updateRequest = new UpdatePostRequest();
            updateRequest.setTitle(request.getTitle());
            updateRequest.setContent(request.getContent());
            updateRequest.setExcerpt(request.getExcerpt());

            PostResponse response = postService.updatePost(id, updateRequest, user.getId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @Valid @RequestBody DeletePostRequestWithAuth request) {
        try {
            // Validate credentials with auth service
            User user = authValidationService.validateCredentials(request.getAuth());

            postService.deletePost(id, user.getId());
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Post Service is running");
    }
}
