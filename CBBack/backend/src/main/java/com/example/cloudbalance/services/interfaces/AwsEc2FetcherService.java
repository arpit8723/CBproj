package com.example.cloudbalance.services.interfaces;

import java.util.List;
import java.util.Map;

public interface AwsEc2FetcherService {
    public List<Map<String, Object>> fetchInstances(String roleArn, String region);
}
