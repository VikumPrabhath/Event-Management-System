package com.eventmanagement.repository;

import com.eventmanagement.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    List<Event> findByOrganizerId(String organizerId);
    List<Event> findByCategory(String category);
}
