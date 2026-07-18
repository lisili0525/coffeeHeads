package com.coffeeforum.concurrentcontentservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ConcurrentContentServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConcurrentContentServiceApplication.class, args);
    }
}
