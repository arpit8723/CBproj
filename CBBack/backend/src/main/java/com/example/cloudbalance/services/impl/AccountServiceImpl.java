package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.AccountDto;
import com.example.cloudbalance.dto.CreateAccountRequest;
import com.example.cloudbalance.entity.AccountEntity;
import com.example.cloudbalance.repository.AccountRepository;
import com.example.cloudbalance.services.interfaces.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public List<AccountDto> getAllAccounts() {
        return accountRepository.findAll()
                .stream()
                .map(a -> new AccountDto(a.getId(), a.getAccountName(),a.getAccountNumber()))
                .collect(Collectors.toList());
    }
    @Override
    public AccountEntity createAccount(CreateAccountRequest request) {
        AccountEntity account = new AccountEntity();
        account.setAccountName(request.getAccountName());
        account.setArn(request.getArn());
        account.setAccountNumber(request.getAccountNumber());
        account.setRegion(request.getRegion());
        account.setOrphan(true); // initially orphan
        return accountRepository.save(account);
    }

    @Override
    public List<AccountEntity> getOrphanAccounts() {
        return accountRepository.findByOrphanTrue();
    }
}
