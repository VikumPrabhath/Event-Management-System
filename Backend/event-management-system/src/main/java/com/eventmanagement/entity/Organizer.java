package com.eventmanagement.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "organizers")
public class Organizer {
    @Id
    private String id;

    private String orgName;
    private String phone;

    @Indexed(unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private boolean isApproved = false;
    private String role = "Organizer";

    // New Profile Fields
    private String profileImageUrl;
    private String description;
    private String website;
}
