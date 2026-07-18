package com.coffeeforum.concurrentcontentservice.controller;
import com.coffeeforum.concurrentcontentservice.model.Tag;
import com.coffeeforum.concurrentcontentservice.model.ThreadView;
import com.coffeeforum.concurrentcontentservice.repository.ReplyRepository;
import com.coffeeforum.concurrentcontentservice.repository.TagRepository;
import com.coffeeforum.concurrentcontentservice.repository.ThreadViewRepository;
import org.springframework.transaction.annotation.Transactional;

import com.coffeeforum.concurrentcontentservice.dto.CreateThreadRequest;
import com.coffeeforum.concurrentcontentservice.dto.UpdateThreadRequest;
import com.coffeeforum.concurrentcontentservice.model.Category;
import com.coffeeforum.concurrentcontentservice.model.ForumThread;
import com.coffeeforum.concurrentcontentservice.model.User;
import com.coffeeforum.concurrentcontentservice.repository.CategoryRepository;
import com.coffeeforum.concurrentcontentservice.repository.ForumThreadRepository;
import com.coffeeforum.concurrentcontentservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/threads")
public class ForumThreadController {

    private final ForumThreadRepository threadRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ThreadViewRepository threadViewRepository;
    private final ReplyRepository replyRepository;
    private final TagRepository tagRepository;

    public ForumThreadController(ForumThreadRepository threadRepository,
                                  CategoryRepository categoryRepository,
                                  UserRepository userRepository,
                                  ThreadViewRepository threadViewRepository,
                                  ReplyRepository replyRepository,
                                  TagRepository tagRepository) {
        this.threadRepository = threadRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.threadViewRepository = threadViewRepository;
        this.replyRepository = replyRepository;
        this.tagRepository = tagRepository;
    }

    private Set<Tag> resolveTags(List<String> tagNames) {
        Set<Tag> tags = new HashSet<>();
        for (String rawName : tagNames) {
            String name = rawName.trim().toLowerCase();
            if (name.isEmpty()) continue;
            Tag tag = tagRepository.findByName(name).orElseGet(() -> tagRepository.save(new Tag(name)));
            tags.add(tag);
        }
        return tags;
    }

    private boolean canModify(ForumThread thread, User user) {
        return user.getRole() == User.Role.ADMIN || thread.getAuthor().getId().equals(user.getId());
    }

    @GetMapping
    public Page<ForumThread> getAllThreads(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return threadRepository.findAll(pageable);
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
    public Page<ForumThread> getThreadsByCategory(
            @PathVariable Long categoryId,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return threadRepository.findByCategoryId(categoryId, pageable);
    }

    @GetMapping("/tag/{tagName}")
    public Page<ForumThread> getThreadsByTag(
            @PathVariable String tagName,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return threadRepository.findByTagsName(tagName.trim().toLowerCase(), pageable);
    }

    @GetMapping("/search")
    public Page<ForumThread> searchThreads(
            @RequestParam String q,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return threadRepository.findByTitleContainingIgnoreCaseOrBodyContainingIgnoreCase(q, q, pageable);
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
        thread.setTags(resolveTags(request.getTagNames()));

        ForumThread saved = threadRepository.save(thread);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateThread(@PathVariable Long id,
                                           @Valid @RequestBody UpdateThreadRequest request,
                                           Authentication authentication) {
        ForumThread thread = threadRepository.findById(id).orElse(null);
        if (thread == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Thread not found");
        }

        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }
        if (!canModify(thread, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not the author of this thread");
        }

        thread.setTitle(request.getTitle());
        thread.setBody(request.getBody());
        thread.setTags(resolveTags(request.getTagNames()));

        ForumThread saved = threadRepository.save(thread);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteThread(@PathVariable Long id, Authentication authentication) {
        ForumThread thread = threadRepository.findById(id).orElse(null);
        if (thread == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Thread not found");
        }

        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }
        if (!canModify(thread, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not the author of this thread");
        }

        // No cascade is configured at the JPA/DB level, so replies and view
        // records referencing this thread must be removed first or the
        // delete fails on the FK constraint.
        replyRepository.deleteByThreadId(id);
        threadViewRepository.deleteByThreadId(id);
        threadRepository.delete(thread);

        return ResponseEntity.noContent().build();
    }
}