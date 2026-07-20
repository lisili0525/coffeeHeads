package com.coffeeforum.concurrentcontentservice.model;

import jakarta.persistence.*;

@Entity
@Table(name = "news_items")
public class NewsItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "source_url", nullable = false, unique = true)
    private String sourceUrl;

    @Column(name = "source_name", nullable = false)
    private String sourceName;

    @Column(name = "published_at", nullable = false)
    private java.time.Instant publishedAt;

    @Column(name = "fetched_at", nullable = false, updatable = false)
    private java.time.Instant fetchedAt;

    @PrePersist
    protected void onCreate() {
        this.fetchedAt = java.time.Instant.now();
    }

    // getters and setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public String getSourceUrl() { return sourceUrl; }
    public void setSourceUrl(String sourceUrl) { this.sourceUrl = sourceUrl; }

    public String getSourceName() { return sourceName; }
    public void setSourceName(String sourceName) { this.sourceName = sourceName; }

    public java.time.Instant getPublishedAt() { return publishedAt; }
    public void setPublishedAt(java.time.Instant publishedAt) { this.publishedAt = publishedAt; }

    public java.time.Instant getFetchedAt() { return fetchedAt; }
}
