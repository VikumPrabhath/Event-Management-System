package com.eventmanagement.service;

import com.eventmanagement.entity.Event;
import com.eventmanagement.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get events by category
    public List<Event> getEventsByCategory(String category) {
        if (category == null || category.equals("All")) {
            return eventRepository.findAll();
        }
        return eventRepository.findByCategory(category);
    }

    public Optional<Event> getEventById(String id) {
        return eventRepository.findById(id);
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(String id, Event event) {
        event.setId(id);
        return eventRepository.save(event);
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}