package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.services.interfaces.AwsEc2FetcherService;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AwsEc2FetcherServiceImpl implements AwsEc2FetcherService {

    public List<Map<String, Object>> fetchInstances(String roleArn, String region) {
        // Step 1: Assume the role
        StsClient stsClient = StsClient.builder()
                .region(Region.of(region))
                .build();

        AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("fetchEc2Session")
                .build(); // No externalId needed

        AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

        AwsSessionCredentials tempCredentials = AwsSessionCredentials.create(
                assumeRoleResponse.credentials().accessKeyId(),
                assumeRoleResponse.credentials().secretAccessKey(),
                assumeRoleResponse.credentials().sessionToken()
        );

        // Step 2: Use temporary creds to query EC2
        Ec2Client ec2Client = Ec2Client.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(tempCredentials))
                .build();

        DescribeInstancesResponse response = ec2Client.describeInstances();
        List<Map<String, Object>> instanceList = new ArrayList<>();

        for (Reservation reservation : response.reservations()) {
            for (Instance instance : reservation.instances()) {
                Map<String, Object> instanceInfo = new HashMap<>();
                instanceInfo.put("instanceId", instance.instanceId());
                instanceInfo.put("state", instance.state().nameAsString());
                instanceInfo.put("type", instance.instanceTypeAsString());
                instanceInfo.put("launchTime", instance.launchTime().toString());
                instanceList.add(instanceInfo);
            }
        }

        return instanceList;
    }
}
