package com.example.cloudbalance.controller;


import com.example.cloudbalance.services.interfaces.AwsEc2FetcherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ec2")
public class AwsController {
    private final AwsEc2FetcherService fetcherService;

    public AwsController(AwsEc2FetcherService fetcherService) {
        this.fetcherService = fetcherService;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getInstances(
            @RequestParam String roleArn,
            @RequestParam String region
    ) {
        List<Map<String, Object>> instances = fetcherService.fetchInstances(roleArn, region);
        return ResponseEntity.ok(instances);
    }

}
