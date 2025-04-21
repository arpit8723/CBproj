package com.example.cloudbalance.exception;

public class HttpRequestMethodNotSupportedException extends RuntimeException {
    public HttpRequestMethodNotSupportedException(String message) {
        super(message);
    }
}
