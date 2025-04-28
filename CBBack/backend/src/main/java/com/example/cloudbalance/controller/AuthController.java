package com.example.cloudbalance.controller;

import com.example.cloudbalance.dto.LoginRequestDto;
import com.example.cloudbalance.services.interfaces.AuthService;
import com.example.cloudbalance.session.LastActivityTracker;
import com.example.cloudbalance.session.TokenBlacklist;
import com.example.cloudbalance.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private LastActivityTracker activityTracker;

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDto loginRequestDto) {
        String token = authService.login(loginRequestDto);
        Map<String, String> response = Map.of("token", token);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/hello")
    public String hello() {
        return "Hello, secured world!";
    }

    @Autowired
    private TokenBlacklist tokenBlacklist;

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            String email = jwtUtil.getEmailFromToken(token);


            activityTracker.remove(email);
            tokenBlacklist.blacklistToken(token);
            System.out.println("logged out");

            return ResponseEntity.ok("Logout successful.");
        }

        return ResponseEntity.badRequest().body("No token provided.");
    }

}
