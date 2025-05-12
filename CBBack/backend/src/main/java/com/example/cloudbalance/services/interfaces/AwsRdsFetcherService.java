package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.Ec2InstanceDto;
import com.example.cloudbalance.dto.RdsInstanceDto;

import java.util.List;

public interface AwsRdsFetcherService {
    public List<RdsInstanceDto> fetchInstances(String roleArn, String region);
}
