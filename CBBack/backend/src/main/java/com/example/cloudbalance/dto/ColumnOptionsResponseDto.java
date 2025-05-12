package com.example.cloudbalance.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class ColumnOptionsResponseDto {
    private List<String> columns;
}
