package com.example.cloudbalance.config;

import com.example.cloudbalance.session.LastActivityTracker;
import com.example.cloudbalance.session.TokenBlacklist;
import com.example.cloudbalance.util.JwtUtil;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private LastActivityTracker activityTracker;

    @Autowired
    private TokenBlacklist tokenBlacklist;

    @Autowired
    private ObjectMapper objectMapper;



    private static final long INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String header = request.getHeader("Authorization");
        String token = null;
        String email = null;

        if (header != null && header.startsWith("Bearer ")) {
            token = header.substring(7);

            if (tokenBlacklist.isBlacklisted(token)) {
                handleError(response, "Token has been blacklisted.");
                return;
            }


            try {
                if (jwtUtil.validateToken(token)) {
                    email = jwtUtil.getEmailFromToken(token);
                    System.out.println(email);


                    Long lastActivity = activityTracker.getLastActivity(email);
                    long now = System.currentTimeMillis();
                    System.out.println(now);

                    if (lastActivity != null && now - lastActivity > INACTIVITY_LIMIT) {
                        activityTracker.remove(email);
                        tokenBlacklist.blacklistToken(token);
                        handleError(response, "Session expired due to inactivity.");
                        return;
                    }


                    activityTracker.updateLastActivity(email);


                    String role = jwtUtil.getClaimFromToken(token, "role");


                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        List.of(new SimpleGrantedAuthority(role))
                                );

                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }

            } catch (Exception e) {
                handleError(response, "Invalid or expired token.");
            }
            filterChain.doFilter(request, response);
        } else {
            handleError(response, "Missing or malformed Authorization header.");

        }


    }
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        return path.equals("/api/auth/login"); // Add more paths if needed
    }
    private void handleError(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        Map<String, String> error = Map.of("error", message);
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
