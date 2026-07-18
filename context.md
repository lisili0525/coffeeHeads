# Project Context: Coffee Forum Backend (a.k.a. "Concurrent Content Service")

## Purpose of this file
This is a persistent context doc for a multi-session build. Paste this whole file
into a new chat with Claude to resume exactly where we left off — goals, decisions,
data model, and current status all live here so nothing has to be re-explained.

## Background / why this project exists
This project started as a resume bullet ("Concurrent Content Service | Java, Spring
Boot, PostgreSQL, Redis, Docker, JUnit") that was written before the project was
actually built. The owner decided to **actually build it for real** so the resume
claim is true and defensible in interviews — not just to look good on paper, but to
genuinely understand and be able to explain every design decision.

**Ground rule: build it for real, understand every piece, don't just copy-paste.**
The goal is to be able to answer follow-up interview questions like "why RocksDB
over Postgres" or "what happens when a Kafka consumer crashes mid-batch" —
here specifically: "what happens when two replies are submitted with the same
idempotency key" or "why did you cache this endpoint and not that one" or
"why flat replies instead of nested threads."

## The concept (UPDATED — pivoted from blog to forum)
A backend API for a **coffee forum** — categories (e.g. "Brew Methods", "Bean
Reviews", "Gear Talk"), discussion threads within categories, and replies within
threads. One or more ADMIN users moderate (create/lock/delete categories and
threads); readers can optionally create accounts to post threads, reply, and have
their viewing history tracked. Structure is **flat**: categories → threads →
replies (no nested replies-to-replies, classic phpBB-style).

## Tech stack
- Java + Spring Boot (REST API)
- PostgreSQL (source of truth)
- Redis (caching hot reads)
- Docker (containerization)
- JUnit + Mockito (testing)
- Spring Security + JWT (auth)

## Data model (current plan — UPDATED for forum)
```
users
- id, email, password_hash, display_name, role (ADMIN/READER), created_at

categories
- id, name, slug, description, created_at

threads          (was "posts" in the old blog model)
- id, category_id (FK -> categories), title, slug, body, author_id (FK -> users),
  status (OPEN/LOCKED/PINNED), view_count, created_at, updated_at

replies          (was "comments" in the old blog model; flat — no self-referencing FK)
- id, thread_id (FK -> threads), user_id (FK -> users), body, created_at

thread_views     (was "reading_history")
- id, user_id (FK -> users), thread_id (FK -> threads), viewed_at

tags (optional, e.g. "pour-over", "espresso", "light-roast")
- id, name

thread_tags (join table)
- thread_id, tag_id
```

## Feature -> concept mapping (so resume bullets stay true)
- REST endpoints: `GET /categories`, `GET /categories/{slug}/threads`,
  `POST /threads` (any logged-in user), `POST /threads/{id}/replies`,
  `GET /users/me/history`
- RBAC: only ADMIN can create/lock/delete categories and moderate threads; any
  logged-in user can create threads/replies
- Redis caching: cache category list + popular thread detail pages
- Rate limiting: protect reply creation and thread-list endpoints from abuse
- Idempotency keys: prevent duplicate reply creation on client retry
- Pagination: `GET /categories/{slug}/threads?page=2&size=10`
- Transactions: e.g. creating a reply + updating a thread's reply count
  atomically
- Indexes: e.g. `(user_id, thread_id)` on thread_views for fast lookups

## Scope note (added mid-project)
Original resume-bullet scope was backend-only. Owner has since confirmed they
want an actual browsable frontend too — "deploying the website" means a real
site people can visit, not just an API tested via curl/Postman. Frontend work
comes after the backend API is functionally complete (Steps 1-7), as a new
Step 9. Tech choice for frontend not yet decided — revisit when we get there.

## Planned build order
1. Scaffold Spring Boot project + Postgres connection; basic CRUD on `users`
   and `categories`/`threads`
2. Auth (Spring Security + JWT) + RBAC for categories/threads
3. Replies (exercises relationships + idempotency)
4. Thread view tracking (reading history)
5. Redis caching for hot paths
6. Rate limiting, timeouts/retries
7. JUnit/Mockito tests (written alongside each step, not bolted on at the end)
8. Dockerize + CI
9. Frontend (simple browsable site) + actual deployment (host, domain,
   managed Postgres, real env-based secrets)

## Status log
*(Update this section each session with what's actually done.)*
- [~] Step 1: Spring Boot scaffold + users/categories/threads CRUD — in progress
      - Postgres 16 running in Docker via docker-compose, container
        `coffee-forum-db`. NOTE: host port remapped to **5433** (not 5432)
        because a pre-existing native Postgres 18 (EDB installer, launchd
        daemon at /Library/PostgreSQL/18) already owns port 5432 on this Mac.
        `application.properties` datasource URL must use 5433.
      - Spring Boot project generated via start.spring.io API (curl), Maven,
        group `com.coffeeforum`, artifact `concurrent-content-service`.
        NOTE: Spring Boot is now on a new major version, **4.1.0** (released
        June 2026), not 3.x — generated with bootVersion=4.1.0. Java 21,
        via Homebrew openjdk@21 (Intel Mac, /usr/local/opt/openjdk@21).
      - Entities created: `User` (with Role enum ADMIN/READER), `Category`,
        `ForumThread` (renamed from `Thread` to avoid collision with
        java.lang.Thread).
      - Repositories created: `UserRepository`, `CategoryRepository`,
        `ForumThreadRepository` (Spring Data JPA, query derivation methods
        like findByEmail/findBySlug/findByCategoryId).
      - `CategoryController` built and verified end-to-end: GET /categories,
        POST /categories confirmed working via curl AND verified directly
        in Postgres via psql.
      - Known gap to fix later: controller currently accepts the raw
        `Category`/entity via @RequestBody — should introduce DTOs so
        clients can't set fields like `id`/`createdAt` directly.
      - Still to do for Step 1: User controller (needs a plan for not
        accepting plaintext passwords even in a smoke test), ForumThread
        controller.
- [x] Step 2: Auth + RBAC — DONE (built ahead of original order, right after
      Category CRUD, since we chose to go deep on auth before finishing all
      basic CRUD)
      - Dependencies: spring-boot-starter-security, jjwt-api/impl/jackson
        0.13.0
      - `PasswordEncoder` bean (BCryptPasswordEncoder) in SecurityConfig
      - `POST /users/register` — DTO-based (RegisterRequest, no `role` field
        exposed to clients), duplicate-email check, BCrypt hashing, hardcodes
        new users to READER role (no self-service admin creation)
      - `JwtService` — HS256, in-memory secret generated at startup (NOTE:
        invalidates all tokens on every restart; fine for dev, would need a
        persistent secret from env/config for production), 1hr expiration,
        embeds email (subject) + role (custom claim)
      - `POST /auth/login` (AuthController) — verifies via
        passwordEncoder.matches(), identical error message for
        wrong-password vs no-such-email (avoids user enumeration), issues
        JWT on success
      - `JwtAuthFilter` — OncePerRequestFilter, reads Authorization: Bearer
        header, validates token, sets SecurityContextHolder authentication
        with ROLE_<role> authority (note the required "ROLE_" prefix
        convention for hasRole() to match)
      - `SecurityConfig` filter chain: CSRF disabled (stateless JWT API, no
        cookie session to protect), STATELESS session policy,
        /users/register + /auth/login public, GET /categories/** public,
        POST /categories/** requires hasRole("ADMIN"), everything else
        requires authentication. JwtAuthFilter wired in via
        addFilterBefore(UsernamePasswordAuthenticationFilter.class)
      - Verified end-to-end via curl: register, duplicate-email rejection,
        login + decoded JWT payload, READER blocked from POST /categories
        (403), ADMIN (manually promoted via psql UPDATE) succeeds (200)
      - Known gaps to revisit later: JwtService secret should move to
        persistent config; no admin-creation flow yet (manual SQL only);
        password reset/logout/refresh tokens not built
- [x] Step 1 (ForumThread piece): ForumThreadController — DONE
      - `CreateThreadRequest` DTO (no authorId field — author is derived
        from the authenticated request via `Authentication authentication`
        param + authentication.getName(), never trusted from client input)
      - GET /threads, GET /threads/{slug}, GET /threads/category/{categoryId}
        — all public
      - POST /threads — requires authentication (any role, not ADMIN-only;
        falls through to .anyRequest().authenticated() in SecurityConfig)
      - Manual category-exists / author-exists checks before insert, for
        clean 400s instead of raw FK constraint violations
      - BUG FOUND + FIXED: nested User (as thread.author) was leaking
        passwordHash in JSON responses — the setPasswordHash(null) trick
        used in register() doesn't scale to every endpoint that nests a
        User. Fixed properly with @JsonIgnore directly on the
        passwordHash field in User.java (Jackson-level, not JPA — coexists
        fine with @Column since they govern separate concerns).
      - Known gap (not yet fixed): lazy-loaded @ManyToOne proxies leak
        Hibernate internals ("hibernateLazyInitializer":{}) into JSON
        responses. Cosmetic/not a security issue, but a known Spring+
        Hibernate+Jackson gotcha. Real fix is response DTOs (or the
        jackson-datatype-hibernate module) — same direction as the
        Category/User request-DTO gaps already noted.
      - Verified end-to-end via curl: create (author correctly derived from
        JWT, not client input), all three GET routes work unauthenticated.
- [x] Step 3: Replies — DONE
      - `Reply` entity: FK to ForumThread + User, unique idempotencyKey
        column (nullable off; enforced at DB level, not just app code)
      - `ReplyRepository`: findByThreadId, findByIdempotencyKey
      - `CreateReplyRequest` DTO — idempotencyKey supplied by client
        (client generates it once per logical submit action, resends same
        key on retries)
      - `ReplyController`: GET /threads/{id}/replies (public),
        POST /threads/{id}/replies (any authenticated user). Idempotency
        check runs first, before thread/user lookups, to short-circuit
        wasted work on duplicates. Returns 201 + new reply on first
        success, 200 + the ORIGINAL reply (same id/createdAt) on a
        repeated idempotencyKey.
      - Known nuance (not a bug, just a limit of current implementation):
        theoretical race condition if two identical requests hit at the
        exact same instant — DB's unique constraint on idempotency_key
        prevents actual duplication, but the loser of the race would get
        a raw constraint-violation error instead of a graceful 200. Full
        hardening would catch that specific exception and re-query. Not
        blocking, just something to be able to explain.
      - Verified end-to-end via curl: first POST with a given idempotencyKey
        -> 201 id=1; identical repeat POST -> 200, same id=1 and same
        createdAt (confirmed no duplicate row created); different
        idempotencyKey -> new 201, new id.
- [x] Step 4: Thread view tracking — DONE
      - `ThreadView` entity: composite unique constraint on (user_id,
        thread_id) via @Table(uniqueConstraints=...) — upsert model (one
        row per user/thread, updated on repeat views), NOT a full view log
        (deliberate scope decision: counter for aggregate views, lightweight
        per-user "last viewed" for history, no per-view audit log)
      - `ThreadViewRepository`: findByUserIdAndThreadId (for the upsert
        check), findByUserIdOrderByViewedAtDesc (drives /users/me/history)
      - `ForumThread.viewCount` incremented atomically via a @Modifying
        @Query bulk UPDATE (avoids read-modify-write race condition/lost
        updates under concurrency) rather than read-then-increment-in-Java
      - GET /threads/{slug} now: increments view count (any visitor,
        including anonymous) + upserts a ThreadView row (authenticated
        users only), wrapped in @Transactional so both succeed/fail
        together
      - GET /users/me/history (UserController) — returns the authenticated
        user's own view history, most recent first; user always derived
        from JWT, never a request param, so no cross-user history leakage
      - BUG FOUND + FIXED: bulk @Modifying update bypasses Hibernate's
        persistence context, so the `thread` object loaded earlier in the
        same method was stale (viewCount lagged one request behind the
        real DB value). Fixed by re-fetching the thread via findById right
        after the increment, before using it further in the method. Real,
        specific Hibernate gotcha worth being able to explain.
      - Also learned: Spring Security's default AnonymousAuthenticationFilter
        sets a non-null Authentication with getName()=="anonymousUser" for
        unauthenticated requests on permitAll() routes — checking for null
        alone is NOT sufficient to detect "not logged in."
      - Verified end-to-end via curl: repeated views increment counter
        correctly (no more lag), thread_views stays at one row per
        user/thread across multiple views (upsert confirmed, not
        duplicated), /users/me/history returns correct data.
- [x] Step 5: Redis caching — DONE
      - Redis added to docker-compose.yml (redis:7, container
        coffee-forum-cache, port 6379, no volume — deliberate, cache is
        disposable/re-derivable from Postgres, unlike the DB itself which
        has a named volume)
      - NOTE: renaming the project folder mid-project (coffeeHead ->
        coffeeHeads) changed Docker Compose's auto-generated project name,
        which orphaned the original coffeehead_coffee-forum-data volume
        (Compose volume names are prefixed by folder-derived project name).
        Original test data lost; re-seeded fresh rather than chasing the
        old volume. Lesson: don't rename a project folder that has a live
        docker-compose stack without expecting volume-name side effects.
      - Dependencies: spring-boot-starter-data-redis, spring-boot-starter-cache
      - spring.data.redis.host/port in application.properties (no auth,
        fine for local dev only)
      - @EnableCaching added to the main application class (required —
        @Cacheable is inert without it, a common silent-failure gotcha)
      - @Cacheable("categories") on GET /categories,
        @CacheEvict(value="categories", allEntries=true) on POST
        /categories — the standard read/write cache pairing, forgetting
        the evict half causes stale-data bugs
      - RedisConfig: custom RedisCacheManagerBuilderCustomizer bean with
        10-min TTL as a safety-net backstop alongside explicit @CacheEvict
      - THREE real version-specific bugs hit and fixed, all stemming from
        Spring Boot 4 / Spring Data Redis 4 / Jackson 3 being newer than
        Claude's training data — verified against live docs each time
        rather than guessing twice:
        1. Default Redis serialization is Java's native ObjectOutputStream,
           which requires entities to implement Serializable (ours don't,
           nor should they need to for JPA). Fixed by switching to JSON
           serialization instead.
        2. RedisCacheManagerBuilderCustomizer moved packages in Spring Boot
           4: now org.springframework.boot.cache.autoconfigure, not the
           old org.springframework.boot.autoconfigure.cache /
           org.springframework.data.redis.cache.
        3. GenericJackson2JsonRedisSerializer is deprecated as of Spring
           Data Redis 4.0 in favor of GenericJacksonJsonRedisSerializer
           (Jackson 3-based, "2" dropped from the name). The new class also
           has no no-arg constructor — requires an explicit
           tools.jackson.databind.json.JsonMapper instance passed in.
      - Verified end-to-end: first GET /categories shows a Hibernate SELECT
        (cache miss), second identical GET shows NO new SQL at all (served
        from Redis) — confirmed both via app console logs and directly via
        redis-cli KEYS/GET showing the real cached JSON. POST /categories
        correctly evicts the cache (next GET re-hits Postgres and reflects
        the new data).
- [x] Step 6: Rate limiting / retries — DONE
      - `RateLimitFilter` (OncePerRequestFilter, wired in via
        addFilterAfter(rateLimitFilter, JwtAuthFilter.class) — runs after
        JWT auth so SecurityContextHolder is already populated)
      - Fixed-window counting algorithm using Redis's atomic INCR
        (StringRedisTemplate.opsForValue().increment) + EXPIRE set only on
        the first increment in a window (setting it every time would let
        an attacker keep pushing the window forward indefinitely — a real
        naive-implementation bug avoided)
      - Known tradeoff (named, not fixed): fixed-window allows up to ~2x
        the intended rate right at window boundaries; a sliding-window or
        token-bucket algorithm would fix this at the cost of complexity.
        Good next-level talking point if asked to improve it.
      - Limit: 10 requests / 60 seconds, currently applied to
        POST /threads/{id}/replies and GET /threads, GET /categories
      - Identifier: authenticated user's email when logged in (via
        SecurityContextHolder, same anonymousUser-sentinel check pattern
        used elsewhere), falls back to IP address (getRemoteAddr()) for
        anonymous requests
      - Returns 429 with a JSON error body when exceeded
      - BUG FOUND + FIXED: a Java fluent-chain syntax error — semicolon
        placed after .addFilterBefore(...) instead of at the true end of
        the chain (after .addFilterAfter(...)), which terminated the
        statement early and turned the next .addFilterAfter(...) line into
        an "illegal start of expression". General lesson: in a builder-
        style method chain, the semicolon only ever belongs once, at the
        very end of the whole chain.
      - Verified end-to-end: 12 rapid GET /categories requests -> 10x 200,
        then 2x 429. Confirmed the actual Redis key directly via
        redis-cli KEYS 'rate:*' (correctly IP-keyed for the unauthenticated
        test requests, using IPv6 loopback form since curl resolved
        localhost to ::1).
- [ ] Step 7: Tests — SKIPPED for now (deliberate decision, not an
      oversight). We relied on manual curl verification for every feature
      all night instead of JUnit. This is a real, named gap: manual curl
      tests don't run automatically, aren't a regression suite, and can't
      be run in CI — so the CI step in Step 8 currently has nothing
      automated to actually run. Revisit before considering this
      "interview ready" — being able to say "I tested manually throughout"
      is weaker than having an actual test suite to point to.
- [x] Step 8: Docker + CI (app containerization done; CI not yet done)
      - Multi-stage Dockerfile for the Spring Boot app itself:
        stage 1 (maven:3.9-eclipse-temurin-21) builds the jar via
        mvn clean package -DskipTests; stage 2 (eclipse-temurin:21-jre,
        much smaller — JRE only, no JDK/Maven/compiler) copies in ONLY the
        built jar. Final deployed image doesn't contain build tooling or
        source code at all — smaller, faster to ship, smaller attack
        surface. pom.xml copied and `mvn dependency:go-offline` run BEFORE
        copying src/, deliberately, so Docker's layer cache reuses the
        (slow) dependency-download layer on rebuilds where only source
        code changed.
      - docker-compose.yml now has all three services together: postgres,
        redis, and app (built from ./concurrent-content-service via
        `build:`, not a prebuilt image like the other two)
      - Critical concept: inside Docker's network, services reach each
        other BY SERVICE NAME (e.g. jdbc:postgresql://postgres:5432/...,
        not localhost:5433). The 5433 host-port remap we needed all night
        for the Mac's own EDB Postgres conflict is irrelevant inside
        Docker's internal network — containers use Postgres's real default
        port 5432 talking to each other; 5433 only ever mattered for the
        host machine reaching in from outside.
      - Config externalized via environment variables in docker-compose.yml
        (SPRING_DATASOURCE_URL, SPRING_DATA_REDIS_HOST, etc.) — Spring Boot
        auto-maps SCREAMING_SNAKE_CASE env vars to dotted property names.
        This is the same mechanism flagged earlier as the real fix for the
        JWT-secret-regenerates-on-restart issue (not yet applied there,
        but the pattern now exists in the codebase and is easy to extend).
      - depends_on: [postgres, redis] on the app service — noted
        limitation: this only controls container START ORDER, not
        actual readiness (Postgres reporting "started" isn't the same
        as "ready to accept connections"). Real production fix would be
        proper healthchecks; not added yet, flagged as known gap.
      - Verified end-to-end: docker compose up -d --build brought up all
        three containers cleanly; GET /categories from the host machine
        returned correct existing data, confirming app <-> Postgres and
        app <-> Redis both work correctly over Docker's internal network
        with zero local Java/Maven/Postgres/Redis installation needed.
      - CI (e.g. GitHub Actions) not yet set up — reasonable next step
        once Step 7 tests exist, since CI's main job is running the test
        suite automatically on push.
- [~] Step 9: Frontend + actual deployment — IN PROGRESS
      - Stack decision: React + Vite (not CRA — CRA is effectively
        deprecated now), plain JS (no TypeScript for now), ESLint chosen
        over the newer Oxlint linter (Oxlint is a legitimate newer/faster
        option worth knowing about, but ESLint has the bigger ecosystem
        and was the more conservative choice for tonight)
      - Deployment target decided: Render for backend (Spring Boot + 
        Postgres + Redis) — free tier, accepts cold-start-after-15-min-
        idle tradeoff, which is fine for a portfolio project. Railway was
        considered but ruled out — it dropped its free tier back in 2024,
        now ~$5/mo minimum. Vercel for frontend (user already familiar
        with it from a personal site).
      - Frontend structure: src/api.js (centralized fetch wrapper, auto-
        attaches JWT from localStorage via Authorization header),
        src/AuthContext.jsx (React Context for auth state; decodes JWT
        client-side via atob() on the payload segment — same "JWT payload
        is just base64, not encrypted" property proven via command line
        hours earlier, now used to read email/role in the browser with no
        server round-trip), pages: Login, Register, Categories, ThreadList,
        ThreadDetail. react-router-dom for routing.
      - Reply idempotency key generated client-side via
        crypto.randomUUID() — the actual client half of the backend
        idempotency system built earlier tonight.
      - BUG FOUND + FIXED (frontend): `npm install react-router-dom` was
        run but never actually landed in package.json (silently — package
        existed in node_modules but wasn't tracked as a dependency),
        producing a classic "Invalid hook call" / duplicate-React error
        from a version-mismatched, untracked copy. Root-caused by
        comparing the actual package.json contents rather than trusting
        that the install had worked; fixed by re-running the install in
        the correct directory and confirming it was saved.
      - BUG FOUND + FIXED (integration): CORS was never configured on the
        backend. Spring Security's filter chain processes/can block
        requests BEFORE controller-level @CrossOrigin would ever apply,
        so CORS has to be configured via a CorsConfigurationSource bean
        wired into the security filter chain itself (.cors(...) as the
        first item in the chain), not at the controller layer. Currently
        hardcoded to allow http://localhost:5173 only — will need the
        real Vercel URL added once deployed.
      - Still to do: verify full loop (register/login/browse/create
        thread/reply) end-to-end from the frontend; deploy backend to
        Render; point frontend's VITE_API_URL at the live Render URL
        (currently defaults to localhost:8080); deploy frontend to Vercel;
        add the deployed frontend origin to backend CORS config.
      - KNOWN BUG (found, not yet fixed — deliberately deferred): thread
        view count increments by 2 per page load in dev. Root cause
        understood precisely: GET /threads/{slug} has a side effect
        (increments viewCount + upserts ThreadView), which violates HTTP's
        "GET should be safe/no side effects" semantics — and React
        StrictMode deliberately double-invokes useEffect in development
        specifically to surface exactly this kind of bug. Correct fix
        (agreed but not yet implemented): split into a pure GET (read-only)
        + a separate POST /threads/{id}/view endpoint, called once from
        the frontend with a useRef guard to survive StrictMode's double-
        invoke. Note: this only double-counts in DEV (StrictMode doesn't
        run in production builds), but the underlying GET-has-side-effects
        design issue is real regardless and should still be fixed before
        calling this "done."

## How to resume in a new chat
Paste this file, then say what you want to work on next (e.g. "let's do Step 1").
Claude should explain concepts as they come up, have the user write/understand the
code (not just receive finished code to paste blindly), and update the Status log
as steps are completed.