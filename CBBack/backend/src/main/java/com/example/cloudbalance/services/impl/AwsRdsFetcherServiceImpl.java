package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.RdsInstanceDto;
import com.example.cloudbalance.exception.AwsAccessException;
import com.example.cloudbalance.services.interfaces.AwsRdsFetcherService;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.rds.RdsClient;
import software.amazon.awssdk.services.rds.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;
import software.amazon.awssdk.services.rds.model.DescribeDbInstancesResponse;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AwsRdsFetcherServiceImpl implements AwsRdsFetcherService {

    public List<RdsInstanceDto> fetchInstances(String roleArn, String region) {

        try{
        StsClient stsClient = StsClient.builder()
                .region(Region.of(region))
                .build();

        AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                .roleArn(roleArn)
                .roleSessionName("fetchRdsSession")
                .build();

        AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

        AwsSessionCredentials tempCredentials = AwsSessionCredentials.create(
                assumeRoleResponse.credentials().accessKeyId(),
                assumeRoleResponse.credentials().secretAccessKey(),
                assumeRoleResponse.credentials().sessionToken()
        );

        // Step 2: Use temporary creds to query RDS
        RdsClient rdsClient = RdsClient.builder()
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(tempCredentials))
                .build();

        DescribeDbInstancesResponse response = rdsClient.describeDBInstances();
        List<RdsInstanceDto> instanceList = new ArrayList<>();

        for (DBInstance dbInstance : response.dbInstances()) {
            // Extract Name tag if available
            String instanceName = "Unnamed";
            try {
                ListTagsForResourceResponse tagResponse = rdsClient.listTagsForResource(
                        ListTagsForResourceRequest.builder()
                                .resourceName(dbInstance.dbInstanceArn())
                                .build()
                );

                instanceName = tagResponse.tagList().stream()
                        .filter(tag -> "Name".equals(tag.key()))
                        .map(Tag::value)
                        .findFirst()
                        .orElse("Unnamed");

            } catch (Exception e) {
                System.out.println("Failed to fetch tags for RDS instance: " + dbInstance.dbInstanceIdentifier());
            }

            RdsInstanceDto instanceDto = new RdsInstanceDto(
                    dbInstance.dbInstanceIdentifier(),       // resourceId
                    instanceName,                            // resourceName
                    region,                                  // region
                    dbInstance.engine(),                     // engine
                    dbInstance.dbInstanceStatus()            // status
            );

            instanceList.add(instanceDto);
        }

        return instanceList; }
    catch (Exception e) {
        throw new AwsAccessException("Failed to Info for this account: " + e.getMessage()); // 👈 One-liner
    }
    }
}
