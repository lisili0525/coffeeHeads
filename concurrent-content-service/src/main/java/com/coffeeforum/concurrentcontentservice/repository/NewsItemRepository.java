package com.coffeeforum.concurrentcontentservice.repository;

import com.coffeeforum.concurrentcontentservice.model.NewsItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface NewsItemRepository extends JpaRepository<NewsItem, Long> {
    Page<NewsItem> findAllByOrderByPublishedAtDesc(Pageable pageable);
    boolean existsBySourceUrl(String sourceUrl);
    void deleteByPublishedAtBefore(Instant cutoff);
}
