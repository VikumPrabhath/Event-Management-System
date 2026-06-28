package com.eventmanagement.service;

import com.eventmanagement.dto.LoginRequest;
import com.eventmanagement.dto.RegisterRequest;
import com.eventmanagement.entity.User;
import com.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {

        // Check if Password and Confirm Password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match!");
        }

        // Check if Email already exists
        if (userRepository.findByEmail(request.getEmail()) != null) {
            throw new RuntimeException("Email is already registered!");
        }

        // Check if Mobile Number already exists
        if (userRepository.findByMobileNo(request.getMobileNo()) != null) {
            throw new RuntimeException("Mobile number is already registered!");
        }

        // Create User Entity from DTO
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNo(request.getMobileNo());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Hash it!
        user.setVerificationMethod(request.getVerificationMethod() != null ? request.getVerificationMethod() : "EMAIL");
        user.setVerified(false); // Not verified until they confirm OTP/link
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Save to MongoDB
        return userRepository.save(user);
    }

    public User loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        if (user == null) {
            throw new RuntimeException("Invalid email or password!");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        return user;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public void deleteUser(String id) {
        userRepository.deleteById(id);
    }
}