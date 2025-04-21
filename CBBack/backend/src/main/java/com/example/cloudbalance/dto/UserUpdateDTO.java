package com.example.cloudbalance.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.Set;

@Getter
@Setter
public class UserUpdateDTO {
    private String username;
    private String email;
    private String password;
    private String role;
    private Set<Long> accountIds;
}
