package com.example.cloudbalance.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class GroupedCostData {
    private String groupKey;
    private Double totalCost;
}
