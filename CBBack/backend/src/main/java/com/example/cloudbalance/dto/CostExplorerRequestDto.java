package com.example.cloudbalance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;


@Getter
@Setter
@AllArgsConstructor
public class CostExplorerRequestDto {
    private String groupBy; // Changed from String to List<String>
    private List<String> filters;
    private LocalDate startDate;
    private LocalDate endDate;
}