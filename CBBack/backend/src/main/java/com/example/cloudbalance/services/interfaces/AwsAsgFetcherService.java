package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.AsgGroupDto;

import java.util.List;

public interface AwsAsgFetcherService {
    public List<AsgGroupDto> fetchAutoScalingGroups(String roleArn, String region);
}
