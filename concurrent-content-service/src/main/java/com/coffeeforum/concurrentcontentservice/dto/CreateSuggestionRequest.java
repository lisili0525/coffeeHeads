package com.coffeeforum.concurrentcontentservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateSuggestionRequest {

    @NotBlank
    @Size(max = 120)
    private String title;

    @NotBlank
    private String body;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}
