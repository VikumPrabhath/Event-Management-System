package com.eventmanagement.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String id;

    private String title;
    private String category; // e.g. music, drama, sports, family
    private String description;
    private String venue;
    private String date;
    private String timeFrom;
    private String timeTo;
    private String imageUrl;
    private String trendingTag; // e.g. status: trending, fast-selling, popular play

    private List<TicketTier> ticketTiers = new ArrayList<>();

    private double earlyBirdDiscount = 0.0; // percentage e.g. 10.0 for 10%
    private int earlyBirdLimit = 0; // limit for early bookings
    private int ticketsSold = 0;
    
    private String organizerId;
}
