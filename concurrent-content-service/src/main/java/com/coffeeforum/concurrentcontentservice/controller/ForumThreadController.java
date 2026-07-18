package com.coffeeforum.concurrentcontentservice.controller;
import com.coffeeforum.concurrentcontentservice.model.ThreadView;
import com.coffeeforum.concurrentcontentservice.repository.ThreadViewRepository;
import org.springframework.transaction.annotation.Transactional;

import com.coffeeforum.concurrentcontentservice.dto.CreateThreadRequest;
import com.coffeeforum.concurrentcontentservice.model.Category;
import com.coffeeforum.concurrentcontentservice.model.ForumThread;
import com.coffeeforum.concurrentcontentservice.model.User;
import com.coffeeforum.concurrentcontentservice.repository.CategoryRepository;
import com.coffeeforum.concurrentcontentservice.repository.ForumThreadRepository;
import com.coffeeforum.concurrentcontentservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/threads")
public class ForumThreadController {

    private final ForumThreadRepository threadRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ThreadViewRepository threadViewRepository;

    public ForumThreadController(ForumThreadRepository threadRepository,
                                  CategoryRepository categoryRepository,
                                  UserRepository userRepository,
                                  ThreadViewRepository threadViewRepository) {
        this.threadRepository = threadRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.threadViewRepository = threadViewRepository;
    }

    @GetMapping
    public List<ForumThread> getAllThreads() {
        return threadRepository.findAll();
    }

    @GetMapping("/{slug}")
    @Transactional
    public ResponseEntity<?> getThreadBySlug(@PathVariable String slug, Authentication authentication) {
        var threadOpt = threadRepository.findBySlug(slug);
        if (threadOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Thread not found");
        }

        ForumThread thread = threadOpt.get();

        threadRepository.incrementViewCount(thread.getId());
        thread = threadRepository.findById(thread.getId()).orElseThrow();

        boolean isAuthenticated = authentication != null && !"anonymousUser".equals(authentication.getName());
        if (isAuthenticated) {
            User user = userRepository.findByEmail(authentication.getName()).orElse(null);
            if (user != null) {
                ThreadView view = threadViewRepository.findByUserIdAndThreadId(user.getId(), thread.getId())
                        .orElse(new ThreadView());
                view.setUser(user);
                view.setThread(thread);
                view.setViewedAt(java.time.Instant.now());
                threadViewRepository.save(view);
            }
        }

        return ResponseEntity.ok(thread);
    }

    @GetMapping("/category/{categoryId}")
    public List<ForumThread> getThreadsByCategory(@PathVariable Long categoryId) {
        return threadRepository.findByCategoryId(categoryId);
    }

    @PostMapping
    public ResponseEntity<?> createThread(@Valid @RequestBody CreateThreadRequest request,
                                           Authentication authentication) {

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Category not found");
        }

        String authorEmail = authentication.getName();
        User author = userRepository.findByEmail(authorEmail)
                .orElse(null);
        if (author == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }

        ForumThread thread = new ForumThread();
        thread.setCategory(category);
        thread.setAuthor(author);
        thread.setTitle(request.getTitle());
        thread.setSlug(request.getSlug());
        thread.setBody(request.getBody());

        ForumThread saved = threadRepository.save(thread);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}