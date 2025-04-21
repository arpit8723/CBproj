package com.example.cloudbalance.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "accounts")
@Getter
@Setter
public class AccountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountName;

    private String arn;

    private boolean orphan = true;

    @Column(name = "account_number", unique = true, nullable = false)
    private String accountNumber;

    @Column(name = "region", nullable = false)
    private String region;

    @ManyToMany(mappedBy = "accounts")
    private Set<UserEntity> users = new HashSet<>();
}

