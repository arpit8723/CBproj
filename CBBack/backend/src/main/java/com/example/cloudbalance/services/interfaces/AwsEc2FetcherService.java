package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.Ec2InstanceDto;

import java.util.List;
import java.util.Map;

public interface AwsEc2FetcherService {
    public List<Ec2InstanceDto> fetchInstances(String roleArn, String region);
}
