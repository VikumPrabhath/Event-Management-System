package com.eventmanagement.service;

import com.eventmanagement.entity.User;
import com.eventmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    // LOGIN VALIDATION
    public User authenticate(String email, String rawPassword) {

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("Invalid email or password!");
        }

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Invalid email or password!");
        }

        return user;
    }
}
