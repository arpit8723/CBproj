package com.example.cloudbalance.controller;

import com.example.cloudbalance.dto.AccountDto;
import com.example.cloudbalance.dto.CreateAccountRequest;
import com.example.cloudbalance.entity.AccountEntity;

import com.example.cloudbalance.services.interfaces.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PreAuthorize("hasAnyAuthority('ADMIN', 'READONLY')")
    @GetMapping("/get")
    public ResponseEntity<List<AccountDto>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'READONLY')")
    @PostMapping("/create")
    public ResponseEntity<AccountEntity> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return ResponseEntity.ok(accountService.createAccount(request));
    }
}
