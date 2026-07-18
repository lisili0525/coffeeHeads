package com.coffeeforum.concurrentcontentservice.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateReplyRequest {

    @NotBlank
    private String body;

    @NotBlank
    private String idempotencyKey;

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }

    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
}