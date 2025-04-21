package com.example.cloudbalance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAccountRequest {

    @NotBlank(message = "Account name is required")
    private String accountName;

    @NotBlank(message = "IAM Role ARN is required")
    @Pattern(
            regexp = "^arn:aws:iam::\\d{12}:role/[\\w+=,.@-]{1,64}$",
            message = "IAM Role ARN format is invalid"
    )
    private String arn;

    @NotBlank(message = "AWS Account ID is required")
    @Pattern(
            regexp = "^\\d{12}$",
            message = "Account ID must be exactly 12 digits"
    )
    private String accountNumber;

    @NotBlank(message = "AWS Region is required")
    @Pattern(
            regexp = "^[a-z]{2}-[a-z]+-\\d$",
            message = "Region must follow format (e.g. us-east-1)"
    )
    private String region;
}
