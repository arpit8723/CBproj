package com.example.cloudbalance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RdsInstanceDto {
    private String resourceId;
    private  String resourceName;
    private String region;
    private String engine;
    private  String status;
}
