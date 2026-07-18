package com.coffeeforum.concurrentcontentservice.repository;

import com.coffeeforum.concurrentcontentservice.model.ThreadView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ThreadViewRepository extends JpaRepository<ThreadView, Long> {
    Optional<ThreadView> findByUserIdAndThreadId(Long userId, Long threadId);
    List<ThreadView> findByUserIdOrderByViewedAtDesc(Long userId);
}