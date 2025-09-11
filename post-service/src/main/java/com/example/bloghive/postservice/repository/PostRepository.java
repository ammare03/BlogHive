package com.example.bloghive.postservice.repository;

import com.example.bloghive.postservice.model.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    
    Optional<Post> findBySlug(String slug);
    
    Page<Post> findByStatus(Post.PostStatus status, Pageable pageable);
    
    Page<Post> findByAuthorId(Long authorId, Pageable pageable);
    
    Page<Post> findByAuthorIdAndStatus(Long authorId, Post.PostStatus status, Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Post> findByStatusAndTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            @Param("status") Post.PostStatus status,
            @Param("keyword") String keyword,
            Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE t IN :tags AND p.status = :status")
    Page<Post> findByTagsInAndStatus(@Param("tags") List<String> tags, 
                                     @Param("status") Post.PostStatus status, 
                                     Pageable pageable);
    
    boolean existsBySlug(String slug);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.authorId = :authorId")
    Long countByAuthorId(@Param("authorId") Long authorId);
    
    @Query("SELECT COUNT(p) FROM Post p WHERE p.authorId = :authorId AND p.status = :status")
    Long countByAuthorIdAndStatus(@Param("authorId") Long authorId, @Param("status") Post.PostStatus status);
}
