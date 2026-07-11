package com.eventmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TicketTier {
    private String name;
    private int capacity;
    private double price;
    private int sold = 0;
}
