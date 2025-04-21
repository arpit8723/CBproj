package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.LoginRequestDto;

public interface AuthService {
    String login(LoginRequestDto loginRequestDto);
}
