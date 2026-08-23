package com.eventmanagement.controller;

import com.eventmanagement.service.EventService;
import com.eventmanagement.entity.Event;
import com.eventmanagement.dto.EventSummaryDTO;
import com.eventmanagement.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class EventController {

    private final EventRepository eventRepository;
    private final EventService eventService;

    @GetMapping("/summary")
    public ResponseEntity<List<EventSummaryDTO>> getEventSummaries() {
        List<EventSummaryDTO> summaries = eventRepository.findAll().stream().map(e -> {
            EventSummaryDTO dto = new EventSummaryDTO();
            dto.setId(e.getId());
            dto.setTitle(e.getTitle());
            dto.setCategory(e.getCategory());
            dto.setDate(e.getDate());
            dto.setTimeFrom(e.getTimeFrom());
            dto.setVenue(e.getVenue());
            dto.setImageUrl(e.getImageUrl());
            dto.setTrendingTag(e.getTrendingTag());
            dto.setMinPrice(e.getTicketTiers() == null || e.getTicketTiers().isEmpty() ? 0 : e.getTicketTiers().get(0).getPrice());
            dto.setEarlyBirdDiscount(e.getEarlyBirdDiscount());
            dto.setEarlyBirdLimit(e.getEarlyBirdLimit());
            dto.setTicketsSold(e.getTicketsSold());
            int totalCap = e.getTicketTiers() == null ? 0 : e.getTicketTiers().stream().mapToInt(com.eventmanagement.entity.TicketTier::getCapacity).sum();
            dto.setTotalCapacity(totalCap);
            dto.setStatus(e.getStatus() == null ? "ACTIVE" : e.getStatus());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    // GET ALL EVENTS (with optional category filter)
    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents(
            @RequestParam(required = false) String category) {
        List<Event> events;
        if (category != null && !category.isEmpty()) {
            events = eventService.getEventsByCategory(category);
        } else {
            events = eventService.getAllEvents();
        }
        return ResponseEntity.ok(events);
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizerId(@PathVariable String organizerId) {
        return ResponseEntity.ok(eventRepository.findByOrganizerId(organizerId));
    }

    // GET EVENT BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE EVENT
    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            Event savedEvent = eventService.createEvent(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE EVENT
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Event> cancelEvent(@PathVariable String id) {
        return eventService.cancelEvent(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE EVENT
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEvent(@PathVariable String id) {
        eventService.deleteEvent(id);
    }
}
