package com.eventmanagement.controller;

import com.eventmanagement.dto.ForgotPasswordRequest;
import com.eventmanagement.dto.ResetPasswordRequest;
import com.eventmanagement.dto.VerifyCodeRequest;
import com.eventmanagement.service.PasswordResetService;
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
    private final PasswordResetService passwordResetService;

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

    // Forgot Password - Send verification code
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.sendVerificationCode(request.getEmail());
            return ResponseEntity.ok("Verification code sent to your email!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Verify Code
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        try {
            boolean isValid = passwordResetService.verifyCode(request.getEmail(), request.getCode());
            if (isValid) {
                return ResponseEntity.ok("Code verified successfully!");
            } else {
                return ResponseEntity.badRequest().body("Invalid or expired verification code!");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Reset Password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(
                    request.getEmail(),
                    request.getCode(),
                    request.getNewPassword(),
                    request.getConfirmPassword()
            );
            return ResponseEntity.ok("Password reset successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
