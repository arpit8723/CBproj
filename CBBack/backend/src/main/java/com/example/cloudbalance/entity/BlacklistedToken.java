package com.example.cloudbalance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;

@Getter
@Setter
@Entity
@AllArgsConstructor

@Table(name = "blacklisted_token")
public class BlacklistedToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 500)
    private String token;

    @Column(name="blacklisted_at",nullable = false)
    private Instant blacklistedAt;

    public BlacklistedToken(String token, Instant blacklistedAt){
        this.token=token;
        this.blacklistedAt=blacklistedAt;
    }


}
