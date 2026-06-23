package com.eventmanagement.controller;

import com.eventmanagement.entity.User;
import com.eventmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")   // Standard REST API path
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // React එකට අවසර දීම
public class UserController {

    private final UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}