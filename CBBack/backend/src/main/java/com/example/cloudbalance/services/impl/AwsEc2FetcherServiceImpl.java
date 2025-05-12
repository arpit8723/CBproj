package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.Ec2InstanceDto;
import com.example.cloudbalance.exception.AwsAccessException;
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

    public List<Ec2InstanceDto> fetchInstances(String roleArn, String region) {
        // Step 1: Assume the role
        try {
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
            List<Ec2InstanceDto> instanceList = new ArrayList<>();

            for (Reservation reservation : response.reservations()) {
                for (Instance instance : reservation.instances()) {
                    // Extract Name tag if available
                    String instanceName = instance.tags().stream()
                            .filter(tag -> "Name".equals(tag.key()))
                            .map(Tag::value)
                            .findFirst()
                            .orElse("Unnamed");

                    Ec2InstanceDto instanceDto = new Ec2InstanceDto(
                            instance.instanceId(),                // resourceId
                            instance.state().nameAsString(),      // status
                            instanceName,                         // resourceName
                            region                                // region
                    );

                    instanceList.add(instanceDto);
                }
            }


            return instanceList;
        } catch (RuntimeException e) {
            throw new AwsAccessException("Failed to Info for this account: " + e.getMessage()); // 👈 One-liner
        }
    }
}