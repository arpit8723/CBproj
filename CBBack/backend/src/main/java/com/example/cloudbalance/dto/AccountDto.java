package com.example.cloudbalance.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccountDto {
    private Long id;
    private String accountName;
    private String accountNumber;

}
