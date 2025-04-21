package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.AccountDto;
import com.example.cloudbalance.dto.CreateAccountRequest;
import com.example.cloudbalance.entity.AccountEntity;

import java.util.List;

public interface AccountService {
    List<AccountEntity> getOrphanAccounts();
    List<AccountDto> getAllAccounts();
    AccountEntity createAccount(CreateAccountRequest request);
}
