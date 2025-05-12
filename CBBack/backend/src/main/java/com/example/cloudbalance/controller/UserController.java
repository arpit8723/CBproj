package com.example.cloudbalance.controller;

import com.example.cloudbalance.dto.CustomerInfoDto;
import com.example.cloudbalance.dto.UserCreateRequestDto;
import com.example.cloudbalance.dto.UserResponseDto;
import com.example.cloudbalance.dto.UserUpdateDTO;
import com.example.cloudbalance.services.interfaces.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;



    // ✅ Admin can create a user
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody UserCreateRequestDto dto) {
        UserResponseDto createdUser = userService.createUser(dto);
        return ResponseEntity.ok(createdUser);
    }

    // ✅ Admin can fetch all users
    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'READONLY')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public String updateUser(
            @PathVariable Long id,
            @RequestBody @Valid UserUpdateDTO dto) {
        userService.updateUser(id, dto);
        return "update successful";
    }
    @GetMapping("/customers")
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<CustomerInfoDto> getAllCustomers() {
        return userService.getAllCustomers();
    }


}
