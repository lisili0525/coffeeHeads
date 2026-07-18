package com.coffeeforum.concurrentcontentservice.repository;

import com.coffeeforum.concurrentcontentservice.model.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    List<Reply> findByThreadId(Long threadId);
    Optional<Reply> findByIdempotencyKey(String idempotencyKey);
    void deleteByThreadId(Long threadId);
}