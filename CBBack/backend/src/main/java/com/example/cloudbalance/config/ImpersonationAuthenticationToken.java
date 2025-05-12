package com.example.cloudbalance.config;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class ImpersonationAuthenticationToken extends UsernamePasswordAuthenticationToken {

    private final String originalEmail;
    private final String originalRole;
    private final String originalUsername;

    public ImpersonationAuthenticationToken(
            Object principal,
            Object credentials,
            Collection<? extends GrantedAuthority> authorities,
            String originalEmail,
            String originalRole,
            String originalUsername) {
        super(principal, credentials, authorities);
        this.originalEmail = originalEmail;
        this.originalRole = originalRole;
        this.originalUsername = originalUsername;
    }

    public String getOriginalEmail() {
        return originalEmail;
    }

    public String getOriginalRole() {
        return originalRole;
    }

    public String getOriginalUsername() {
        return originalUsername;
    }
}