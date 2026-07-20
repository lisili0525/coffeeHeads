package com.coffeeforum.concurrentcontentservice.controller;

import com.coffeeforum.concurrentcontentservice.model.NewsItem;
import com.coffeeforum.concurrentcontentservice.repository.NewsItemRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/news")
public class NewsController {

    private final NewsItemRepository newsItemRepository;

    public NewsController(NewsItemRepository newsItemRepository) {
        this.newsItemRepository = newsItemRepository;
    }

    @GetMapping
    public Page<NewsItem> getNews(@PageableDefault(size = 10) Pageable pageable) {
        return newsItemRepository.findAllByOrderByPublishedAtDesc(pageable);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNewsItem(@PathVariable Long id) {
        if (!newsItemRepository.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("News item not found");
        }
        newsItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
