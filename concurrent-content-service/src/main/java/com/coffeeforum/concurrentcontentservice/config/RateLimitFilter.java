package com.coffeeforum.concurrentcontentservice.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final StringRedisTemplate redisTemplate;

    private static final int LIMIT = 10;
    private static final Duration WINDOW = Duration.ofSeconds(60);

    public RateLimitFilter(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        boolean isProtected =
                (request.getMethod().equals("POST") && request.getRequestURI().matches("/threads/\\d+/replies")) ||
                (request.getMethod().equals("GET") && (request.getRequestURI().equals("/threads") || request.getRequestURI().equals("/categories")));

        if (!isProtected) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String identifier = getIdentifier(request);
            String key = "rate:" + identifier + ":" + request.getMethod() + ":" + request.getRequestURI();

            Long count = redisTemplate.opsForValue().increment(key);
            if (count != null && count == 1L) {
                redisTemplate.expire(key, WINDOW);
            }

            if (count != null && count > LIMIT) {
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Rate limit exceeded. Try again later.\"}");
                return;
            }
        } catch (Exception e) {
            // Redis unavailable — fail OPEN (allow the request through) rather than
            // blocking all traffic. Rate limiting is a protective feature; losing it
            // temporarily is far better than an outage taking down the whole API.
            logger.warn("Rate limiter unavailable, allowing request through: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getIdentifier(HttpServletRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && !"anonymousUser".equals(authentication.getName())) {
            return authentication.getName();
        }
        return request.getRemoteAddr();
    }
}