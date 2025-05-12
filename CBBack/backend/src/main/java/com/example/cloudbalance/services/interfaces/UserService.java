package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.CustomerInfoDto;
import com.example.cloudbalance.dto.UserCreateRequestDto;
import com.example.cloudbalance.dto.UserResponseDto;
import com.example.cloudbalance.dto.UserUpdateDTO;

import java.util.List;

public interface UserService {

    UserResponseDto createUser(UserCreateRequestDto dto);

    List<UserResponseDto> getAllUsers();

    void updateUser(Long userId, UserUpdateDTO userUpdateDTO);

    public boolean hasAccessToAccount(String email, String accountNumber);

    public List<CustomerInfoDto> getAllCustomers();
}
