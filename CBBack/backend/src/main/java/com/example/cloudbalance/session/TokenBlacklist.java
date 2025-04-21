package com.example.cloudbalance.session;

import java.time.Instant;


import com.example.cloudbalance.entity.BlacklistedToken;
import com.example.cloudbalance.repository.BlacklistedTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TokenBlacklist {
    @Autowired
    private BlacklistedTokenRepository blacklistedTokenRepository;

    public void blacklistToken(String token) {
        BlacklistedToken blacklistedToken = new BlacklistedToken(token, Instant.now());
       blacklistedTokenRepository.save(blacklistedToken);
    }
    public boolean isBlacklisted(String token) {
        return blacklistedTokenRepository.existsByToken(token);
    }
}
