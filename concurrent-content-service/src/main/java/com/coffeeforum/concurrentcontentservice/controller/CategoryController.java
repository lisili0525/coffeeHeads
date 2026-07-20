package com.coffeeforum.concurrentcontentservice.controller;

import com.coffeeforum.concurrentcontentservice.model.Category;
import com.coffeeforum.concurrentcontentservice.repository.CategoryRepository;
import com.coffeeforum.concurrentcontentservice.repository.ForumThreadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final ForumThreadRepository threadRepository;

    public CategoryController(CategoryRepository categoryRepository, ForumThreadRepository threadRepository) {
        this.categoryRepository = categoryRepository;
        this.threadRepository = threadRepository;
    }

    // Not cached: Page<T> is backed by PageImpl, which has no default
    // constructor Jackson can deserialize into without extra Spring Data
    // Jackson-module wiring for our Jackson 3-based Redis serializer, and
    // caching would fan out one Redis key per page/size combo for a table
    // that only ever holds a handful of rows. Not worth the complexity here.
    @GetMapping
    public Page<Category> getAllCategories(@PageableDefault(size = 10) Pageable pageable) {
        return categoryRepository.findAll(pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }
        return ResponseEntity.ok(category);
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Category not found");
        }
        if (threadRepository.existsByCategoryId(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Category still has threads; delete or move them first");
        }
        categoryRepository.delete(category);
        return ResponseEntity.noContent().build();
    }
}