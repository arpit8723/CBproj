package com.example.cloudbalance.controller;


import com.example.cloudbalance.dto.AsgGroupDto;
import com.example.cloudbalance.dto.Ec2InstanceDto;
import com.example.cloudbalance.dto.RdsInstanceDto;
import com.example.cloudbalance.entity.AccountEntity;
import com.example.cloudbalance.repository.AccountRepository;
import com.example.cloudbalance.services.interfaces.AwsAsgFetcherService;
import com.example.cloudbalance.services.interfaces.AwsEc2FetcherService;
import com.example.cloudbalance.services.interfaces.AwsRdsFetcherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/aws")
public class AwsController {
    private final AwsEc2FetcherService fetcherService;
    private final AccountRepository accountRepository;
    private final AwsRdsFetcherService awsRdsFetcherService;
    private final AwsAsgFetcherService awsAsgFetcherService;

    public AwsController(AwsEc2FetcherService fetcherService,AccountRepository accountRepository,AwsRdsFetcherService awsRdsFetcherService,AwsAsgFetcherService awsAsgFetcherService) {
        this.fetcherService = fetcherService;
        this.accountRepository = accountRepository;
        this.awsRdsFetcherService = awsRdsFetcherService;
        this.awsAsgFetcherService=awsAsgFetcherService;
    }

    @GetMapping("ec2/{accountNumber}")
    public ResponseEntity<List<Ec2InstanceDto>> getInstances(@PathVariable String accountNumber) {
        // Fetch account details (ARN and region) based on account number
        AccountEntity account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Use the ARN and region from the account to fetch EC2 instances
        List<Ec2InstanceDto> instances = fetcherService.fetchInstances(account.getArn(), account.getRegion());
        return ResponseEntity.ok(instances);
    }
    @GetMapping("/rds/{accountNumber}")
    public ResponseEntity<List<RdsInstanceDto>> getRdsInstances(@PathVariable String accountNumber) {
        // Fetch account details (ARN and region) based on account number
        AccountEntity account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        // Use the ARN and region from the account to fetch RDS instances
        List<RdsInstanceDto> instances = awsRdsFetcherService.fetchInstances(account.getArn(), account.getRegion());
        return ResponseEntity.ok(instances);
    }
    @GetMapping("/asg/{accountNumber}")
    public ResponseEntity<List<AsgGroupDto>> getAsgGroups(@PathVariable String accountNumber) {
        AccountEntity account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        List<AsgGroupDto> groups = awsAsgFetcherService.fetchAutoScalingGroups(account.getArn(), account.getRegion());
        return ResponseEntity.ok(groups);
    }


}
