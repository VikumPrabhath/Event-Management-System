package com.eventmanagement.controller;

import com.eventmanagement.entity.Organizer;
import com.eventmanagement.repository.OrganizerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

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

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrganizerById(@PathVariable String id) {
        return organizerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateOrganizerProfile(@PathVariable String id, @RequestBody Organizer profileUpdates) {
        return organizerRepository.findById(id)
                .map(org -> {
                    if (profileUpdates.getOrgName() != null) org.setOrgName(profileUpdates.getOrgName());
                    if (profileUpdates.getPhone() != null) org.setPhone(profileUpdates.getPhone());
                    if (profileUpdates.getProfileImageUrl() != null) org.setProfileImageUrl(profileUpdates.getProfileImageUrl());
                    if (profileUpdates.getDescription() != null) org.setDescription(profileUpdates.getDescription());
                    if (profileUpdates.getWebsite() != null) org.setWebsite(profileUpdates.getWebsite());
                    
                    Organizer updated = organizerRepository.save(org);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage(@PathVariable String id, @RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        
        return organizerRepository.findById(id).map(org -> {
            try {
                // Ensure uploads directory exists using absolute path
                Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                }

                // Generate unique filename
                String originalFilename = file.getOriginalFilename();
                String extension = "";
                if (originalFilename != null && originalFilename.contains(".")) {
                    extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                }
                String newFilename = UUID.randomUUID().toString() + extension;
                
                // Save file locally
                Path filePath = uploadDir.resolve(newFilename);
                file.transferTo(filePath.toFile());

                // Update organizer profileImageUrl
                String fileUrl = "http://localhost:8081/uploads/" + newFilename;
                org.setProfileImageUrl(fileUrl);
                organizerRepository.save(org);

                return ResponseEntity.ok(org);
            } catch (IOException e) {
                return ResponseEntity.internalServerError().body("Failed to upload image: " + e.getMessage());
            }
        }).orElse(ResponseEntity.notFound().build());
    }
}
