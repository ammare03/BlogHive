package com.bloghive.postservice.controllers;

import com.bloghive.postservice.models.Post;
import com.bloghive.postservice.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Post createPost(@RequestBody Post post, Authentication authentication) {
        // Extract user ID from JWT token - the principal now contains the userId
        if (authentication != null && authentication.getPrincipal() != null) {
            try {
                Long userId = Long.parseLong(authentication.getPrincipal().toString());
                post.setAuthorId(userId);
            } catch (NumberFormatException e) {
                throw new RuntimeException("Invalid user ID in authentication token");
            }
        } else {
            throw new RuntimeException("Authentication required to create post");
        }
        return postService.save(post);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        return postService.findById(id)
                .map(post -> {
                    post.setTitle(postDetails.getTitle());
                    post.setContent(postDetails.getContent());
                    return ResponseEntity.ok(postService.save(post));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        postService.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/author/{authorId}")
    public List<Post> getPostsByAuthor(@PathVariable Long authorId, Authentication authentication) {
        return postService.findByAuthorId(authorId);
    }
}
