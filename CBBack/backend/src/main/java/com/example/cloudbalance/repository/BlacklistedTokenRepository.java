package com.example.cloudbalance.repository;

import com.example.cloudbalance.entity.BlacklistedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistedTokenRepository extends JpaRepository<BlacklistedToken,Long> {
    boolean existsByToken(String token);
}
