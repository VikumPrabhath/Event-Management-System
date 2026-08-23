package com.eventmanagement.controller;

import com.eventmanagement.entity.Booking;
import com.eventmanagement.entity.Event;
import com.eventmanagement.entity.TicketTier;
import com.eventmanagement.repository.BookingRepository;
import com.eventmanagement.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final EventRepository eventRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        try {
            Optional<Event> optionalEvent = eventRepository.findById(booking.getEventId());
            if (optionalEvent.isEmpty()) {
                return ResponseEntity.badRequest().body("Event not found");
            }
            Event event = optionalEvent.get();
            if ("CANCELLED".equalsIgnoreCase(event.getStatus())) {
                return ResponseEntity.badRequest().body("This event has been cancelled and is no longer available for booking");
            }

            int totalTicketsRequested = 0;

            if (booking.getSelectedTiers() != null) {
                for (Map.Entry<String, Integer> entry : booking.getSelectedTiers().entrySet()) {
                    String tierName = entry.getKey();
                    int qtyRequested = entry.getValue();

                    if (qtyRequested <= 0) continue;

                    boolean found = false;
                    for (TicketTier tier : event.getTicketTiers()) {
                        if (tier.getName().equals(tierName)) {
                            found = true;
                            int available = tier.getCapacity() - tier.getSold();
                            if (qtyRequested > available) {
                                return ResponseEntity.badRequest().body("Not enough tickets available for tier: " + tierName);
                            }
                            tier.setSold(tier.getSold() + qtyRequested);
                            break;
                        }
                    }
                    if (!found) {
                        return ResponseEntity.badRequest().body("Tier " + tierName + " not found in event");
                    }
                    totalTicketsRequested += qtyRequested;
                }
            }

            event.setTicketsSold(event.getTicketsSold() + totalTicketsRequested);
            eventRepository.save(event);

            if (booking.getStatus() == null) {
                booking.setStatus("Confirmed");
            }
            booking.setBookingDate(LocalDateTime.now());
            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/sales-chart")
    public ResponseEntity<List<Map<String, Object>>> getSalesChart() {
        // Simple mock aggregation for the last 7 days based on actual DB records
        // For production, a proper Mongo aggregation pipeline should be used.
        List<Booking> allBookings = bookingRepository.findAll();
        
        // Group by Day of Week
        Map<String, Double> salesByDay = new LinkedHashMap<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (String day : days) {
            salesByDay.put(day, 0.0);
        }

        for (Booking b : allBookings) {
            if (b.getBookingDate() != null) {
                String dayName = b.getBookingDate().getDayOfWeek().name().substring(0, 3);
                String normalizedDay = dayName.substring(0, 1).toUpperCase() + dayName.substring(1).toLowerCase();
                if (salesByDay.containsKey(normalizedDay)) {
                    salesByDay.put(normalizedDay, salesByDay.get(normalizedDay) + b.getTotalAmount());
                }
            }
        }

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map.Entry<String, Double> entry : salesByDay.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("name", entry.getKey());
            dataPoint.put("sales", entry.getValue());
            chartData.add(dataPoint);
        }

        return ResponseEntity.ok(chartData);
    }

    @GetMapping("/event/{eventId}/stats")
    public ResponseEntity<Map<String, Object>> getEventStats(@PathVariable String eventId) {
        Optional<Event> optionalEvent = eventRepository.findById(eventId);
        if (optionalEvent.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Event event = optionalEvent.get();

        List<Booking> bookings = bookingRepository.findByEventId(eventId);
        
        double totalRevenue = 0.0;
        Map<String, Double> salesByDay = new LinkedHashMap<>();
        String[] days = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        for (String day : days) {
            salesByDay.put(day, 0.0);
        }

        for (Booking b : bookings) {
            totalRevenue += b.getTotalAmount();
            if (b.getBookingDate() != null) {
                String dayName = b.getBookingDate().getDayOfWeek().name().substring(0, 3);
                String normalizedDay = dayName.substring(0, 1).toUpperCase() + dayName.substring(1).toLowerCase();
                if (salesByDay.containsKey(normalizedDay)) {
                    salesByDay.put(normalizedDay, salesByDay.get(normalizedDay) + b.getTotalAmount());
                }
            }
        }

        List<Map<String, Object>> chartData = new ArrayList<>();
        for (Map.Entry<String, Double> entry : salesByDay.entrySet()) {
            Map<String, Object> dataPoint = new HashMap<>();
            dataPoint.put("day", entry.getKey());
            dataPoint.put("sales", entry.getValue());
            chartData.add(dataPoint);
        }

        int totalCapacity = 0;
        List<Map<String, Object>> ticketData = new ArrayList<>();
        if (event.getTicketTiers() != null) {
            String[] colors = {"#f5af19", "#e5e4e2", "#00ff80", "#ff007f", "#3498db"};
            for (int i = 0; i < event.getTicketTiers().size(); i++) {
                TicketTier tier = event.getTicketTiers().get(i);
                totalCapacity += tier.getCapacity();
                
                Map<String, Object> tData = new HashMap<>();
                tData.put("name", tier.getName());
                tData.put("sold", tier.getSold());
                tData.put("total", tier.getCapacity());
                tData.put("color", colors[i % colors.length]);
                ticketData.add(tData);
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", "LKR " + String.format("%,.2f", totalRevenue));
        stats.put("totalTicketsSold", event.getTicketsSold());
        stats.put("totalCapacity", totalCapacity);
        stats.put("chartData", chartData);
        stats.put("ticketData", ticketData);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/event/{eventId}/attendees")
    public ResponseEntity<List<Booking>> getEventAttendees(@PathVariable String eventId) {
        List<Booking> bookings = bookingRepository.findByEventId(eventId);
        return ResponseEntity.ok(bookings);
    }
}
