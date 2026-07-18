package com.coffeeforum.concurrentcontentservice.controller;

import com.coffeeforum.concurrentcontentservice.dto.RegisterRequest;
import com.coffeeforum.concurrentcontentservice.model.User;
import com.coffeeforum.concurrentcontentservice.repository.ThreadViewRepository;
import com.coffeeforum.concurrentcontentservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ThreadViewRepository threadViewRepository;

    public UserController(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           ThreadViewRepository threadViewRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.threadViewRepository = threadViewRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setDisplayName(request.getDisplayName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.READER);

        User saved = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/me/history")
    public ResponseEntity<?> getMyHistory(Authentication authentication) {
        if (authentication == null || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not authenticated");
        }

        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }

        return ResponseEntity.ok(threadViewRepository.findByUserIdOrderByViewedAtDesc(user.getId()));
    }
}