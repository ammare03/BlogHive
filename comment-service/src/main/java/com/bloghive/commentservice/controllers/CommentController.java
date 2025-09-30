package com.bloghive.commentservice.controllers;

import com.bloghive.commentservice.models.Comment;
import com.bloghive.commentservice.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPostId(@PathVariable Long postId) {
        return commentService.findByPostId(postId);
    }

    @PostMapping
    public Comment createComment(@RequestBody Comment comment, Authentication authentication) {
        // In a real app, you'd get the user ID from the authentication object
        // For now, we'll just set a placeholder
        comment.setUserId(1L); // Placeholder
        return commentService.save(comment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        commentService.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
