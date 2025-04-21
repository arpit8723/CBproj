package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.LoginRequestDto;
import com.example.cloudbalance.entity.UserEntity;
import com.example.cloudbalance.exception.InvalidCredentialsException;
import com.example.cloudbalance.repository.UserRepository;
import com.example.cloudbalance.services.interfaces.AuthService;
import com.example.cloudbalance.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;



    @Override
    public String login(LoginRequestDto loginDto) {
        UserEntity user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Email or Password"));

//        if (!user.getPassword().equals(loginDto.getPassword())) {
//            throw new RuntimeException("Invalid password");
//        }
        if (!passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }
        // ✅ Generate only one token now
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        return jwtUtil.generateToken(user);
    }
}
