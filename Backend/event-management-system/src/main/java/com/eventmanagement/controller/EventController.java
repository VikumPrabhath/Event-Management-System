package com.eventmanagement.controller;

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
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class EventController {

    private final EventRepository eventRepository;

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
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(summaries);
    }

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody Event event) {
        try {
            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/organizer/{organizerId}")
    public ResponseEntity<List<Event>> getEventsByOrganizerId(@PathVariable String organizerId) {
        return ResponseEntity.ok(eventRepository.findByOrganizerId(organizerId));
    }
}
