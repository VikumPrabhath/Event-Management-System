package com.eventmanagement.repository;

import com.eventmanagement.entity.Organizer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizerRepository extends MongoRepository<Organizer, String> {
    Organizer findByEmail(String email);
}
