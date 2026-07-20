package com.coffeeforum.concurrentcontentservice.service;

import com.coffeeforum.concurrentcontentservice.model.NewsItem;
import com.coffeeforum.concurrentcontentservice.repository.NewsItemRepository;
import com.rometools.rome.feed.synd.SyndEntry;
import com.rometools.rome.feed.synd.SyndFeed;
import com.rometools.rome.io.SyndFeedInput;
import com.rometools.rome.io.XmlReader;
import org.jsoup.Jsoup;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

// Keeps the news feed fresh with zero human involvement: pulls real
// headlines from a fixed set of coffee-industry RSS feeds on startup and
// every few hours, de-duplicating on source URL. Each feed is fetched
// independently so a single dead/slow source never blocks the others.
@Service
public class NewsFetchService {

    private static final Logger log = LoggerFactory.getLogger(NewsFetchService.class);

    private static final Map<String, String> FEED_SOURCES = Map.of(
            "Daily Coffee News", "https://dailycoffeenews.com/feed/",
            "Sprudge", "https://sprudge.com/feed"
    );

    private static final int RETENTION_DAYS = 90;

    private final NewsItemRepository newsItemRepository;

    public NewsFetchService(NewsItemRepository newsItemRepository) {
        this.newsItemRepository = newsItemRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void fetchOnStartup() {
        fetchAll();
    }

    // initialDelay keeps this from firing immediately alongside fetchOnStartup()
    // above - fixedRate with no initialDelay runs its first execution at
    // startup too, which raced the ApplicationReadyEvent listener and caused
    // duplicate-key warnings during testing.
    @Scheduled(fixedRate = 4 * 60 * 60 * 1000, initialDelay = 4 * 60 * 60 * 1000)
    public void fetchOnSchedule() {
        fetchAll();
    }

    public void fetchAll() {
        FEED_SOURCES.forEach(this::fetchSource);
        newsItemRepository.deleteByPublishedAtBefore(Instant.now().minus(RETENTION_DAYS, ChronoUnit.DAYS));
    }

    private void fetchSource(String sourceName, String feedUrl) {
        try {
            SyndFeedInput input = new SyndFeedInput();
            SyndFeed feed;
            try (XmlReader reader = new XmlReader(URI.create(feedUrl).toURL())) {
                feed = input.build(reader);
            }

            List<SyndEntry> entries = feed.getEntries();
            int saved = 0;
            for (SyndEntry entry : entries) {
                if (saveIfNew(sourceName, entry)) {
                    saved++;
                }
            }
            log.info("Fetched {} entries from {} ({} new)", entries.size(), sourceName, saved);
        } catch (Exception e) {
            log.warn("Failed to fetch news feed from {}: {}", sourceName, e.getMessage());
        }
    }

    private boolean saveIfNew(String sourceName, SyndEntry entry) {
        String link = entry.getLink();
        if (link == null || link.isBlank() || newsItemRepository.existsBySourceUrl(link)) {
            return false;
        }

        NewsItem item = new NewsItem();
        item.setTitle(entry.getTitle() != null ? entry.getTitle() : "Untitled");
        item.setSummary(stripHtml(entry.getDescription() != null ? entry.getDescription().getValue() : ""));
        item.setSourceUrl(link);
        item.setSourceName(sourceName);
        item.setPublishedAt(entry.getPublishedDate() != null ? entry.getPublishedDate().toInstant() : Instant.now());

        newsItemRepository.save(item);
        return true;
    }

    // Feed descriptions are HTML embedded in CDATA, so entities like &#160;
    // are never decoded by the XML parser itself - Jsoup.text() both strips
    // tags and decodes entities properly, safer than a hand-rolled regex.
    private String stripHtml(String html) {
        if (html == null) return "";
        return Jsoup.parse(html).text().replaceAll("\\s+", " ").trim();
    }
}
