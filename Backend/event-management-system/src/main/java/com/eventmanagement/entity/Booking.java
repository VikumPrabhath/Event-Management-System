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

    // Dynamic selected tickets (TierName -> Quantity)
    private java.util.Map<String, Integer> selectedTiers;

    // Customer Tracking
    private String customerFirstName;
    private String customerLastName;
    private String customerEmail;
    private String customerPhone;
    private String customerNic;

    private double totalAmount;
    private String paymentMethod;
    private String status; // Confirmed, Expired, Cancelled

    // Cancellation & Refund Tracking
    private double refundAmount;
    private double refundPercentage;
    private LocalDateTime cancelledAt;

    @CreatedDate
    private LocalDateTime bookingDate = LocalDateTime.now();
}
