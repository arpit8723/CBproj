package com.example.cloudbalance.util;

import com.example.cloudbalance.entity.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expirationMs; // 15 mins

    @Value("${jwt.impersonation.expiration:600000}") // Default to 10 minutes if not specified
    private long impersonationExpirationMs;//new

    private Key getSigningKey() {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(UserEntity user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole().name())
                .claim("username", user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateImpersonationToken(UserEntity targetUser, UserEntity adminUser) {
        return Jwts.builder()
                .setSubject(targetUser.getEmail())
                .claim("role", targetUser.getRole().name())
                .claim("username", targetUser.getUsername())
                .claim("isImpersonating", true)
                .claim("originalEmail", adminUser.getEmail())
                .claim("originalRole", adminUser.getRole().name())
                .claim("originalUsername", adminUser.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + impersonationExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }//new

    public String getClaimFromToken(String token, String claimKey) {
        Claims claims = extractAllClaims(token);
        return claims.get(claimKey, String.class);
    }

    public Boolean getBooleanClaimFromToken(String token, String claimKey) {
        Claims claims = extractAllClaims(token);
        return claims.get(claimKey, Boolean.class);
    }//new

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
    public boolean isImpersonationToken(String token) {
        try {
            Boolean isImpersonating = getBooleanClaimFromToken(token, "isImpersonating");
            return isImpersonating != null && isImpersonating;
        } catch (Exception e) {
            return false;
        }
    }

    public String getOriginalEmailFromToken(String token) {
        return getClaimFromToken(token, "originalEmail");
    }

    public String getOriginalRoleFromToken(String token) {
        return getClaimFromToken(token, "originalRole");
    }//new last three
}
