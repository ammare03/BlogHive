package com.example.bloghive.postservice.service;

import com.example.bloghive.postservice.dto.*;
import com.example.bloghive.postservice.model.entity.Post;
import com.example.bloghive.postservice.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${auth.service.url}")
    private String authServiceUrl;

    public PostResponse createPost(CreatePostRequest request, Long authorId, String authorUsername) {
        // Validate author exists by calling Auth Service
        if (!validateAuthor(authorId)) {
            throw new RuntimeException("Author not found");
        }

        // Create post
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthorId(authorId);
        post.setAuthorUsername(authorUsername);

        if (request.getSlug() != null && !request.getSlug().isEmpty()) {
            if (postRepository.existsBySlug(request.getSlug())) {
                throw new RuntimeException("Slug already exists");
            }
            post.setSlug(request.getSlug());
        }

        if (request.getTags() != null) {
            post.setTags(request.getTags());
        }

        if (request.getStatus() != null) {
            post.setStatus(Post.PostStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Post savedPost = postRepository.save(post);

        // Publish post created event
        publishPostEvent("POST_CREATED", savedPost);

        return convertToResponse(savedPost);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Increment view count
        post.incrementViewCount();
        postRepository.save(post);

        return convertToResponse(post);
    }

    public PostResponse getPostBySlug(String slug) {
        Post post = postRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Increment view count
        post.incrementViewCount();
        postRepository.save(post);

        return convertToResponse(post);
    }

    public Page<PostResponse> getAllPosts(int page, int size, String sortBy, String sortDirection) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDirection), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Post> posts = postRepository.findByStatus(Post.PostStatus.PUBLISHED, pageable);
        return posts.map(this::convertToResponse);
    }

    public Page<PostResponse> getPostsByAuthor(Long authorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByAuthorIdAndStatus(authorId, Post.PostStatus.PUBLISHED, pageable);
        return posts.map(this::convertToResponse);
    }

    public Page<PostResponse> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByStatusAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                Post.PostStatus.PUBLISHED, keyword, pageable);
        return posts.map(this::convertToResponse);
    }

    public PostResponse updatePost(Long id, UpdatePostRequest request, Long authorId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if user is the author
        if (!post.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You can only update your own posts");
        }

        // Update fields
        if (request.getTitle() != null) {
            post.setTitle(request.getTitle());
        }

        if (request.getContent() != null) {
            post.setContent(request.getContent());
        }

        if (request.getSlug() != null && !request.getSlug().isEmpty()) {
            if (!request.getSlug().equals(post.getSlug()) && postRepository.existsBySlug(request.getSlug())) {
                throw new RuntimeException("Slug already exists");
            }
            post.setSlug(request.getSlug());
        }

        if (request.getTags() != null) {
            post.setTags(request.getTags());
        }

        if (request.getStatus() != null) {
            Post.PostStatus newStatus = Post.PostStatus.valueOf(request.getStatus().toUpperCase());
            if (newStatus == Post.PostStatus.PUBLISHED && post.getStatus() != Post.PostStatus.PUBLISHED) {
                post.setPublishedAt(LocalDateTime.now());
            }
            post.setStatus(newStatus);
        }

        Post updatedPost = postRepository.save(post);

        // Publish post updated event
        publishPostEvent("POST_UPDATED", updatedPost);

        return convertToResponse(updatedPost);
    }

    public void deletePost(Long id, Long authorId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Check if user is the author
        if (!post.getAuthorId().equals(authorId)) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.delete(post);

        // Publish post deleted event
        publishPostEvent("POST_DELETED", post);
    }

    private boolean validateAuthor(Long authorId) {
        try {
            ResponseEntity<Object> response = restTemplate.getForEntity(
                    authServiceUrl + "/api/v1/auth/users/" + authorId, Object.class);
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    private void publishPostEvent(String eventType, Post post) {
        Map<String, Object> event = new HashMap<>();
        event.put("eventType", eventType);
        event.put("entityId", post.getId());
        event.put("timestamp", LocalDateTime.now().toString());

        Map<String, Object> payload = new HashMap<>();
        payload.put("id", post.getId());
        payload.put("title", post.getTitle());
        payload.put("authorId", post.getAuthorId());
        payload.put("authorUsername", post.getAuthorUsername());
        payload.put("status", post.getStatus().toString());
        payload.put("slug", post.getSlug());
        payload.put("tags", post.getTags());

        event.put("payload", payload);

        kafkaTemplate.send("post-events", event);
    }

    private PostResponse convertToResponse(Post post) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setSlug(post.getSlug());
        response.setAuthorId(post.getAuthorId());
        response.setAuthorUsername(post.getAuthorUsername());
        response.setStatus(post.getStatus().toString());
        response.setTags(post.getTags());
        response.setViewCount(post.getViewCount());
        response.setLikeCount(post.getLikeCount());
        response.setCommentCount(post.getCommentCount());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setPublishedAt(post.getPublishedAt());
        return response;
    }
}
