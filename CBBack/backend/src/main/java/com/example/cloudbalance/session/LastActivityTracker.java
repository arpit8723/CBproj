package com.example.cloudbalance.session;

import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class LastActivityTracker {
    private final ConcurrentHashMap<String, Long> activityMap = new ConcurrentHashMap<>();

    public void updateLastActivity(String email) {
        activityMap.put(email, System.currentTimeMillis());
    }

    public Long getLastActivity(String email) {
        return activityMap.get(email);
    }

    public void remove(String email) {
        activityMap.remove(email);
    }
}
