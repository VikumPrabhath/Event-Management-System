package com.eventmanagement.controller;

import com.eventmanagement.dto.LoginRequest;
import com.eventmanagement.dto.RegisterRequest;
import com.eventmanagement.entity.User;
import com.eventmanagement.service.AuthService;
import com.eventmanagement.service.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000",allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    // LOGIN ENDPOINT
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            // Authenticate the user
            User user = authService.authenticate(request.getEmail(), request.getPassword());

            // Store user in session (this logs them in)
            session.setAttribute("loggedInUser", user);

            // Return user (without password)
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    // LOGOUT ENDPOINT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        // Invalidate (destroy) the session
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully!");
    }

    // CHECK LOGIN STATUS (Optional, for the frontend)
    @GetMapping("/status")
    public ResponseEntity<?> checkStatus(HttpSession session) {
        User user = (User) session.getAttribute("loggedInUser");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }
    }
}
