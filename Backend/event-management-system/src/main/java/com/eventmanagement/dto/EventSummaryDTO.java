package com.eventmanagement.dto;

import lombok.Data;

@Data
public class EventSummaryDTO {
    private String id;
    private String title;
    private String date;
    private String timeFrom;
    private String venue;
    private String imageUrl;
    private String trendingTag;
    private String category;
    private double minPrice;
    
    private double earlyBirdDiscount;
    private int earlyBirdLimit;
    private int ticketsSold;
    private int totalCapacity;
}
