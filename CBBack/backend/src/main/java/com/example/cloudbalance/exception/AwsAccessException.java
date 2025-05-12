package com.example.cloudbalance.exception;

public class AwsAccessException extends RuntimeException {
    public AwsAccessException(String message) {
        super(message);
    }
}
