package com.coffeeforum.concurrentcontentservice.controller;

import com.coffeeforum.concurrentcontentservice.model.Category;
import com.coffeeforum.concurrentcontentservice.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
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

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryRepository.save(category);
    }
}