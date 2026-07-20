package com.coffeeforum.concurrentcontentservice.repository;

import com.coffeeforum.concurrentcontentservice.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByName(String name);

    // thread_tags has no JPA-managed repository of its own since it's a
    // plain join table, so associations must be cleared here before a Tag
    // can be deleted without hitting the tag_id FK constraint.
    @Modifying
    @Query(value = "DELETE FROM thread_tags WHERE tag_id = :tagId", nativeQuery = true)
    void removeThreadAssociations(Long tagId);
}
