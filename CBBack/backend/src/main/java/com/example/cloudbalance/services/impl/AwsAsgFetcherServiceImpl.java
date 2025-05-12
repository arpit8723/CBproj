package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.AsgGroupDto;
import com.example.cloudbalance.exception.AwsAccessException;
import com.example.cloudbalance.services.interfaces.AwsAsgFetcherService;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.autoscaling.AutoScalingClient;
import software.amazon.awssdk.services.autoscaling.model.AutoScalingGroup;

import software.amazon.awssdk.services.autoscaling.model.DescribeAutoScalingGroupsResponse;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class AwsAsgFetcherServiceImpl implements AwsAsgFetcherService {

    @Override
    public List<AsgGroupDto> fetchAutoScalingGroups(String roleArn, String region) {
        try
        {
        StsClient stsClient = StsClient.builder()
                .region(Region.of(region))
                .build();

        AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("fetchAsgSession")
                .build();

        AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

        AwsSessionCredentials tempCredentials = AwsSessionCredentials.create(
                assumeRoleResponse.credentials().accessKeyId(),
                assumeRoleResponse.credentials().secretAccessKey(),
                assumeRoleResponse.credentials().sessionToken()
        );

        // Step 2: Use ASG client
        AutoScalingClient asgClient = AutoScalingClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(tempCredentials))
                .build();

        DescribeAutoScalingGroupsResponse response = asgClient.describeAutoScalingGroups();

        List<AsgGroupDto> result = new ArrayList<>();

        for (AutoScalingGroup group : response.autoScalingGroups()) {
            String groupName = group.autoScalingGroupName();
            String groupArn = group.autoScalingGroupARN();
            int desiredCapacity = group.desiredCapacity();
            int minSize = group.minSize();
            int maxSize = group.maxSize();
            String status = group.status() != null ? group.status() : "N/A";

            AsgGroupDto dto = new AsgGroupDto(
                    groupArn,
                    groupName,
                    region,
                    desiredCapacity,
                    minSize,
                    maxSize,
                    status
            );

            result.add(dto);
        }

        return result; } catch (Exception e) {
        throw new AwsAccessException("Failed to Info for this account: " + e.getMessage()); // 👈 One-liner
    }
    }
}