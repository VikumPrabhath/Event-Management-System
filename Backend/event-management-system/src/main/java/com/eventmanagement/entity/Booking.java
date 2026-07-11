package com.eventmanagement.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;

    private String userId;
    private String eventId;
    private String eventTitle;

    private int goldCount;
    private int platinumCount;
    private int goldTableCount;
    private int platinumTableCount;

    private double totalAmount;
    private String paymentMethod;
    private String status; // Confirmed, Expired, Cancelled

    @CreatedDate
    private LocalDateTime bookingDate = LocalDateTime.now();
}
