package com.eventmanagement.service;

import com.eventmanagement.entity.User;
import com.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;

    // Temporary storage for verification codes (email -> code)
    // In production, use Redis or a database table
    private final Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    private final Map<String, Long> codeTimestamps = new ConcurrentHashMap<>();
    private static final long CODE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

    /**
     * Step 1: Send a verification code to the user's email
     */
    public void sendVerificationCode(String email) {
        // Check if user exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("Email not found!");
        }

        // Generate a 6-digit code
        String code = generateVerificationCode();

        // Store the code with timestamp
        verificationCodes.put(email, code);
        codeTimestamps.put(email, System.currentTimeMillis());

        // Send email
        sendEmail(email, code);
    }

    /**
     * Step 2: Verify the code entered by the user
     */
    public boolean verifyCode(String email, String code) {
        // Check if code exists
        String storedCode = verificationCodes.get(email);
        if (storedCode == null) {
            return false;
        }

        // Check if code has expired
        Long timestamp = codeTimestamps.get(email);
        if (timestamp == null || System.currentTimeMillis() - timestamp > CODE_EXPIRY_MS) {
            verificationCodes.remove(email);
            codeTimestamps.remove(email);
            return false;
        }

        // Verify the code
        return storedCode.equals(code);
    }

    /**
     * Step 3: Reset the password
     */
    public void resetPassword(String email, String code, String newPassword, String confirmPassword) {
        // Check if passwords match
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Passwords do not match!");
        }

        // Verify the code
        if (!verifyCode(email, code)) {
            throw new RuntimeException("Invalid or expired verification code!");
        }

        // Find the user
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found!");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Clean up the verification code
        verificationCodes.remove(email);
        codeTimestamps.remove(email);
    }

    /**
     * Generate a 6-digit verification code
     */
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }

    /**
     * Send verification email
     */
    private void sendEmail(String toEmail, String code) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Password Reset Verification Code");
            message.setText(
                    "Hello,\n\n" +
                            "We received a request to reset your password.\n\n" +
                            "Your verification code is: " + code + "\n\n" +
                            "This code will expire in 5 minutes.\n\n" +
                            "If you did not request this, please ignore this email.\n\n" +
                            "Thank you,\n" +
                            "Event Management System Team"
            );

            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Failed to send email. Please try again.");
        }
    }
}