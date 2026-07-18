package com.coffeeforum.concurrentcontentservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "thread_views", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "thread_id"})
})
public class ThreadView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private ForumThread thread;

    @Column(name = "viewed_at", nullable = false)
    private java.time.Instant viewedAt;

    // getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ForumThread getThread() { return thread; }
    public void setThread(ForumThread thread) { this.thread = thread; }

    public java.time.Instant getViewedAt() { return viewedAt; }
    public void setViewedAt(java.time.Instant viewedAt) { this.viewedAt = viewedAt; }
}