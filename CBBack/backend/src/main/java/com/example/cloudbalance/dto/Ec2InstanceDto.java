package com.example.cloudbalance.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Ec2InstanceDto {
    private String resourceId;
   private String status;
   private String resourceName;
    private String region;
}
