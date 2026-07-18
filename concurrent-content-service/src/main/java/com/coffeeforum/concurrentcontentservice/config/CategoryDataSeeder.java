package com.coffeeforum.concurrentcontentservice.config;

import com.coffeeforum.concurrentcontentservice.model.Category;
import com.coffeeforum.concurrentcontentservice.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CategoryDataSeeder {

    @Bean
    CommandLineRunner seedCategories(CategoryRepository categoryRepository) {
        return args -> {
            seedCategory(
                    categoryRepository,
                    "Brew Methods",
                    "brew-methods",
                    "Pour-over, espresso, French press, and more");
            seedCategory(
                    categoryRepository,
                    "Bean Reviews",
                    "bean-reviews",
                    "Reviews and impressions of specific coffee beans, roasts, and origins");
            seedCategory(
                    categoryRepository,
                    "Gear Talk",
                    "gear-talk",
                    "Grinders, kettles, scales, and every other piece of coffee gear");
            seedCategory(
                    categoryRepository,
                    "Latte Art",
                    "latte-art",
                    "Pouring techniques, practice logs, and showing off your latte art");
            seedCategory(
                    categoryRepository,
                    "Home Roasting",
                    "home-roasting",
                    "Roasting green beans at home - profiles, roasters, and troubleshooting");
            seedCategory(
                    categoryRepository,
                    "Coffee Shops & Cafes",
                    "coffee-shops-cafes",
                    "Recommendations and discussion about cafes worth visiting");
            seedCategory(
                    categoryRepository,
                    "Cold Brew & Iced Coffee",
                    "cold-brew-iced-coffee",
                    "Cold brew, iced pour-over, and other cold coffee methods");
            seedCategory(
                    categoryRepository,
                    "Beginner Questions",
                    "beginner-questions",
                    "New to coffee? Ask anything here, no judgment");
        };
    }

    private void seedCategory(
            CategoryRepository categoryRepository,
            String name,
            String slug,
            String description) {
        categoryRepository.findBySlug(slug).orElseGet(() -> {
            Category category = new Category();
            category.setName(name);
            category.setSlug(slug);
            category.setDescription(description);
            return categoryRepository.save(category);
        });
    }
}
