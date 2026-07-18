package com.coffeeforum.concurrentcontentservice.repository;

import com.coffeeforum.concurrentcontentservice.model.Suggestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuggestionRepository extends JpaRepository<Suggestion, Long> {
    List<Suggestion> findByUserIdOrderByCreatedAtDesc(Long userId);
}
