package com.coffeeforum.concurrentcontentservice.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class UpdateThreadRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String body;

    private List<String> tagNames = List.of();

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public List<String> getTagNames() { return tagNames; }
    public void setTagNames(List<String> tagNames) { this.tagNames = tagNames; }
}
