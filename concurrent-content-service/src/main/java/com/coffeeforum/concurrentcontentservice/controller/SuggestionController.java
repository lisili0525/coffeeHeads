package com.coffeeforum.concurrentcontentservice.controller;

import com.coffeeforum.concurrentcontentservice.dto.CreateSuggestionRequest;
import com.coffeeforum.concurrentcontentservice.model.Suggestion;
import com.coffeeforum.concurrentcontentservice.model.User;
import com.coffeeforum.concurrentcontentservice.repository.SuggestionRepository;
import com.coffeeforum.concurrentcontentservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/suggestions")
public class SuggestionController {

    private final SuggestionRepository suggestionRepository;
    private final UserRepository userRepository;

    public SuggestionController(SuggestionRepository suggestionRepository, UserRepository userRepository) {
        this.suggestionRepository = suggestionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMySuggestions(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }

        return ResponseEntity.ok(suggestionRepository.findByUserIdOrderByCreatedAtDesc(user.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createSuggestion(
            @Valid @RequestBody CreateSuggestionRequest request,
            Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }

        Suggestion suggestion = new Suggestion();
        suggestion.setUser(user);
        suggestion.setTitle(request.getTitle());
        suggestion.setBody(request.getBody());

        return ResponseEntity.status(HttpStatus.CREATED).body(suggestionRepository.save(suggestion));
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || "anonymousUser".equals(authentication.getName())) {
            return null;
        }
        return userRepository.findByEmail(authentication.getName()).orElse(null);
    }
}
