package com.coffeeforum.concurrentcontentservice.controller;

import com.coffeeforum.concurrentcontentservice.dto.CreateReplyRequest;
import com.coffeeforum.concurrentcontentservice.model.ForumThread;
import com.coffeeforum.concurrentcontentservice.model.Reply;
import com.coffeeforum.concurrentcontentservice.model.User;
import com.coffeeforum.concurrentcontentservice.repository.ForumThreadRepository;
import com.coffeeforum.concurrentcontentservice.repository.ReplyRepository;
import com.coffeeforum.concurrentcontentservice.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ReplyController {

    private final ReplyRepository replyRepository;
    private final ForumThreadRepository threadRepository;
    private final UserRepository userRepository;

    public ReplyController(ReplyRepository replyRepository,
                            ForumThreadRepository threadRepository,
                            UserRepository userRepository) {
        this.replyRepository = replyRepository;
        this.threadRepository = threadRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/threads/{threadId}/replies")
    public List<Reply> getRepliesForThread(@PathVariable Long threadId) {
        return replyRepository.findByThreadId(threadId);
    }

    @PostMapping("/threads/{threadId}/replies")
    public ResponseEntity<?> createReply(@PathVariable Long threadId,
                                          @Valid @RequestBody CreateReplyRequest request,
                                          Authentication authentication) {

        // Idempotency check FIRST, before touching the thread/user lookups —
        // if we've already handled this exact request, just return the
        // original result and stop, rather than doing unnecessary work.
        var existing = replyRepository.findByIdempotencyKey(request.getIdempotencyKey());
        if (existing.isPresent()) {
            return ResponseEntity.status(HttpStatus.OK).body(existing.get());
        }

        ForumThread thread = threadRepository.findById(threadId).orElse(null);
        if (thread == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Thread not found");
        }

        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authenticated user not found");
        }

        Reply reply = new Reply();
        reply.setThread(thread);
        reply.setUser(user);
        reply.setBody(request.getBody());
        reply.setIdempotencyKey(request.getIdempotencyKey());

        Reply saved = replyRepository.save(reply);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}