package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.LoginRequestDto;

import java.util.Map;

public interface AuthService {
   public String login(LoginRequestDto loginRequestDto);

}
