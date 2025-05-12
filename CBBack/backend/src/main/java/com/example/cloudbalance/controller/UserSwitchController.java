package com.example.cloudbalance.controller;

import com.example.cloudbalance.config.ImpersonationAuthenticationToken;
import com.example.cloudbalance.entity.UserEntity;
import com.example.cloudbalance.repository.UserRepository;

import com.example.cloudbalance.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class UserSwitchController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/switch-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> switchToUser(@RequestBody Map<String, String> request) {
        String targetEmail = request.get("targetEmail");

        if (targetEmail == null || targetEmail.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Target email is required"));
        }

        // Get admin user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String adminEmail = auth.getName();

        // Don't allow switching to own account
        if (adminEmail.equals(targetEmail)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Cannot switch to your own account"));
        }

        // Find admin user
        Optional<UserEntity> adminUserOpt = userRepository.findByEmail(adminEmail);
        if (adminUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Admin user not found"));
        }
        UserEntity adminUser = adminUserOpt.get();

        // Find target user
        Optional<UserEntity> targetUserOpt = userRepository.findByEmail(targetEmail);
        if (targetUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Target user not found"));
        }
        UserEntity targetUser = targetUserOpt.get();

        // Only allow switching to CUSTOMER accounts
        if (!targetUser.getRole().name().equals("CUSTOMER")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Can only switch to customer accounts"));
        }

        // Generate impersonation token
        String token = jwtUtil.generateImpersonationToken(targetUser, adminUser);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
                "email", targetUser.getEmail(),
                "username", targetUser.getUsername(),
                "role", targetUser.getRole().name()
        ));
        response.put("isImpersonating", true);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/switch-back")
    public ResponseEntity<?> switchBack() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Check if currently impersonating
        if (!(auth instanceof ImpersonationAuthenticationToken)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not currently impersonating a user"));
        }

        ImpersonationAuthenticationToken impAuth = (ImpersonationAuthenticationToken) auth;
        String originalEmail = impAuth.getOriginalEmail();

        // Find original admin user
        Optional<UserEntity> adminUserOpt = userRepository.findByEmail(originalEmail);
        if (adminUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Original admin user not found"));
        }

        UserEntity adminUser = adminUserOpt.get();

        // Generate new standard token for admin
        String token = jwtUtil.generateToken(adminUser);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
                "email", adminUser.getEmail(),
                "username", adminUser.getUsername(),
                "role", adminUser.getRole().name()
        ));
        response.put("isImpersonating", false);

        return ResponseEntity.ok(response);
    }


}