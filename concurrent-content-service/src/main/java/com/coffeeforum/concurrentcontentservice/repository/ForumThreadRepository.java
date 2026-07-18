package com.coffeeforum.concurrentcontentservice.repository;

import com.coffeeforum.concurrentcontentservice.model.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForumThreadRepository extends JpaRepository<ForumThread, Long> {
    Optional<ForumThread> findBySlug(String slug);
    Page<ForumThread> findByCategoryId(Long categoryId, Pageable pageable);
    Page<ForumThread> findByTagsName(String tagName, Pageable pageable);

    // Simple LIKE-based search - fine at this table size. A larger forum
    // would move to Postgres full-text search (tsvector + GIN index) for
    // relevance ranking and better performance.
    Page<ForumThread> findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(
            String title, String body, Pageable pageable);

    @Modifying
    @Query("UPDATE ForumThread t SET t.viewCount = t.viewCount + 1 WHERE t.id = :threadId")
    void incrementViewCount(Long threadId);
}