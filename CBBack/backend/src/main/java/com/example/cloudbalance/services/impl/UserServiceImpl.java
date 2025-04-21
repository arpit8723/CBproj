package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.AccountDto;
import com.example.cloudbalance.dto.UserCreateRequestDto;
import com.example.cloudbalance.dto.UserResponseDto;
import com.example.cloudbalance.dto.UserUpdateDTO;
import com.example.cloudbalance.entity.AccountEntity;
import com.example.cloudbalance.entity.UserEntity;
import com.example.cloudbalance.enums.Role;
import com.example.cloudbalance.exception.AccountAssignmentException;
import com.example.cloudbalance.repository.AccountRepository;
import com.example.cloudbalance.repository.UserRepository;
import com.example.cloudbalance.services.interfaces.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public UserResponseDto createUser(UserCreateRequestDto dto) {
        UserEntity user = new UserEntity();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.valueOf(dto.getRole()));

        if (user.getRole() == Role.CUSTOMER && dto.getAccountIds() != null && !dto.getAccountIds().isEmpty()) {
            Set<AccountEntity> accounts = new HashSet<>(accountRepository.findAllById(dto.getAccountIds()));
            for (AccountEntity account : accounts) {
                account.setOrphan(false);
            }
            user.setAccounts(accounts);
            accountRepository.saveAll(accounts);
        }
        if (user.getRole() != Role.CUSTOMER && dto.getAccountIds() != null && !dto.getAccountIds().isEmpty()) {
            throw new AccountAssignmentException("Only customers can be assigned accounts.");
        }


        UserEntity savedUser = userRepository.save(user);

        // Convert accounts to AccountDto
        Set<AccountDto> accountDtos = savedUser.getAccounts()
                .stream()
                .map(a -> new AccountDto(a.getId(), a.getAccountName(),a.getAccountNumber()))
                .collect(Collectors.toSet());

        return new UserResponseDto(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                accountDtos,
                savedUser.getLastLogin()
        );
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.getAccounts()
                                .stream()
                                .map(a -> new AccountDto(a.getId(), a.getAccountName(),a.getAccountNumber()))
                                .collect(Collectors.toSet()),
                        user.getLastLogin()
                ))
                .collect(Collectors.toList());
    }


    @Override
//    public void updateUser(Long id, UserUpdateDTO dto) {
//        UserEntity user = userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
//
//        user.setUsername(dto.getUsername());
//        user.setEmail(dto.getEmail());
//
//        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
//            user.setPassword(passwordEncoder.encode(dto.getPassword()));
//        }
//
//        Role newRole = Role.valueOf(dto.getRole());
//
//        if (newRole != Role.CUSTOMER && dto.getAccountIds() != null && !dto.getAccountIds().isEmpty()) {
//            throw new IllegalArgumentException("Only customers can be assigned accounts.");
//        }
//        if (user.getRole() == Role.CUSTOMER && newRole != Role.CUSTOMER) {
//            for (AccountEntity account : user.getAccounts()) {
//                long count = userRepository.countByAccounts_IdAndIdNot(account.getId(), user.getId());
//                if (count == 0) {
//                    account.setOrphan(true);
//                    accountRepository.save(account);
//                }
//            }
//            user.getAccounts().clear(); // Remove association
//        }
//        if (newRole == Role.CUSTOMER && dto.getAccountIds() != null) {
//            Set<AccountEntity> accounts = new HashSet<>(accountRepository.findAllById(dto.getAccountIds()));
//            for (AccountEntity account : accounts) {
//                account.setOrphan(false);
//            }
//            user.setAccounts(accounts);
//            accountRepository.saveAll(accounts);
//        }
//        user.setRole(newRole);
//        userRepository.save(user);
//        System.out.println("working fine ");
//
//    }
    public void updateUser(Long id, UserUpdateDTO dto) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));

        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        Role newRole = Role.valueOf(dto.getRole());

        if (newRole != Role.CUSTOMER && dto.getAccountIds() != null && !dto.getAccountIds().isEmpty()) {
            throw new AccountAssignmentException("Only customers can be assigned accounts.");
        }

//        Set<AccountEntity> newAccounts = new HashSet<>();
//        if (newRole == Role.CUSTOMER && dto.getAccountIds() != null) {
//            newAccounts.addAll(accountRepository.findAllById(dto.getAccountIds()));
//        }
        Set<AccountEntity> newAccounts = null;
        if (newRole == Role.CUSTOMER && dto.getAccountIds() != null) {
            newAccounts = new HashSet<>(accountRepository.findAllById(dto.getAccountIds()));
        }

        // Handle orphaning only if role is changing from CUSTOMER to another
        if (user.getRole() == Role.CUSTOMER && newRole != Role.CUSTOMER) {
            for (AccountEntity account : user.getAccounts()) {
                long count = userRepository.countByAccounts_IdAndIdNot(account.getId(), user.getId());
                if (count == 0) {
                    account.setOrphan(true);
                    accountRepository.save(account);
                }
            }
            user.getAccounts().clear();
        }

        // ✅ This handles orphan flag if account removed from user but not due to role change
        if (newRole == Role.CUSTOMER) {
            Set<AccountEntity> currentAccounts = user.getAccounts();
            for (AccountEntity account : currentAccounts) {
                if (!newAccounts.contains(account)) {
                    long count = userRepository.countByAccounts_IdAndIdNot(account.getId(), user.getId());
                    if (count == 0) {
                        account.setOrphan(true);
                        accountRepository.save(account);
                    }
                }
            }

            for (AccountEntity account : newAccounts) {
                account.setOrphan(false);
            }
            user.setAccounts(newAccounts);
            accountRepository.saveAll(newAccounts);
        }

        user.setRole(newRole);
        userRepository.save(user);
    }



}
