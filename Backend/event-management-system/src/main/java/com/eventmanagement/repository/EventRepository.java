package com.eventmanagement.repository;

import com.eventmanagement.entity.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends MongoRepository<Event, String> {
    java.util.List<Event> findByOrganizerId(String organizerId);
}
