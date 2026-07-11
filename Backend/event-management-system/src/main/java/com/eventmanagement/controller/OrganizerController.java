package com.eventmanagement.controller;

import com.eventmanagement.entity.Organizer;
import com.eventmanagement.repository.OrganizerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class OrganizerController {

    private final OrganizerRepository organizerRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Organizer organizer) {
        try {
            if (organizerRepository.findByEmail(organizer.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Email is already registered!");
            }
            organizer.setPassword(passwordEncoder.encode(organizer.getPassword()));
            organizer.setApproved(false);
            Organizer saved = organizerRepository.save(organizer);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Organizer loginReq) {
        Organizer organizer = organizerRepository.findByEmail(loginReq.getEmail());
        if (organizer == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password!");
        }
        if (!passwordEncoder.matches(loginReq.getPassword(), organizer.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password!");
        }
        if (!organizer.isApproved()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your organizer account is pending Admin approval!");
        }
        return ResponseEntity.ok(organizer);
    }

    @GetMapping
    public ResponseEntity<List<Organizer>> getAllOrganizers() {
        return ResponseEntity.ok(organizerRepository.findAll());
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveOrganizer(@PathVariable String id) {
        return organizerRepository.findById(id)
                .map(org -> {
                    org.setApproved(true);
                    organizerRepository.save(org);
                    return ResponseEntity.ok(org);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
