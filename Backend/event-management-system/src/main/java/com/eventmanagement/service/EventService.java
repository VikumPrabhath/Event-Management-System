package com.eventmanagement.service;

import com.eventmanagement.entity.Booking;
import com.eventmanagement.entity.Event;
import com.eventmanagement.repository.BookingRepository;
import com.eventmanagement.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

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
        if (event.getStatus() == null) {
            event.setStatus("ACTIVE");
        }
        return eventRepository.save(event);
    }

    public Event updateEvent(String id, Event event) {
        eventRepository.findById(id).ifPresent(existing -> {
            if (event.getStatus() == null) {
                event.setStatus(existing.getStatus());
            }
        });
        event.setId(id);
        return eventRepository.save(event);
    }

    public Optional<Event> cancelEvent(String id) {
        return eventRepository.findById(id).map(event -> {
            event.setStatus("CANCELLED");
            eventRepository.save(event);

            for (Booking booking : bookingRepository.findByEventId(id)) {
                booking.setStatus("Cancelled");
                bookingRepository.save(booking);
            }
            return event;
        });
    }

    public void deleteEvent(String id) {
        eventRepository.deleteById(id);
    }
}