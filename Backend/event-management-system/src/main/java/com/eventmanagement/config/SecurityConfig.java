package com.eventmanagement.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  // Disable CSRF for API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/users/register").permitAll()  // ✅ Allow registration without login
                        .requestMatchers("/api/users/**").permitAll()        // ✅ Allow all user endpoints for now
                        .anyRequest().authenticated()
                )
                .httpBasic(httpBasic -> httpBasic.disable());  // ✅ Disable HTTP Basic Authentication

        return http.build();
    }
}