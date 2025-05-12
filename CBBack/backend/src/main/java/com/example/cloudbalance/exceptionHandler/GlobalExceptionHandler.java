package com.example.cloudbalance.exceptionHandler;

import com.example.cloudbalance.exception.*;
import lombok.extern.slf4j.Slf4j;
import net.snowflake.client.jdbc.SnowflakeSQLException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.UncategorizedSQLException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleInvalidCredentials(InvalidCredentialsException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED); // 401
    }

    @ExceptionHandler(AccountAssignmentException.class)
    public ResponseEntity<Map<String, String>> handleAccountAssignmentException(AccountAssignmentException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid path variable: " + ex.getValue());
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<String> handleNotFound(NoHandlerFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("Endpoint not found: " + ex.getRequestURL());
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<String> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex) {
        return ResponseEntity
                .status(HttpStatus.METHOD_NOT_ALLOWED)
                .body("HTTP method not allowed for this endpoint. Supported methods: " + String.join(", ", ex.getSupportedMethods()));
    }

    @ExceptionHandler(UnauthorizedAccessException.class)
    public ResponseEntity<Map<String, String>> handleUnauthorizedAccessException(UnauthorizedAccessException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN); // 401
    }

    @ExceptionHandler(AwsAccessException.class)
    public ResponseEntity<?> handleAwsAccessException(AwsAccessException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("error", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }

    // Snowflake SQL Exception (direct)
    @ExceptionHandler(SnowflakeSQLException.class)
    public ResponseEntity<Map<String, Object>> handleSnowflakeSQLException(SnowflakeSQLException ex) {
        // Extract Snowflake error code and SQLState
        int errorCode = ex.getErrorCode();
        String sqlState = ex.getSQLState();
        String message = ex.getMessage();

        // Log detailed error info for debugging
        SnowflakeErrorHandler.logSnowflakeError(errorCode, sqlState, message, ex);

        // Map to appropriate HTTP status and user-friendly message
        HttpStatus status = SnowflakeErrorHandler.mapErrorToHttpStatus(errorCode, sqlState);
        String userMessage = SnowflakeErrorHandler.createUserFriendlyMessage(message, errorCode);

        return buildErrorResponse(status, "Snowflake Database Error", userMessage);
    }



    // Connection exception (likely network or auth issue)
    @ExceptionHandler(CannotGetJdbcConnectionException.class)
    public ResponseEntity<Map<String, Object>> handleConnectionException(CannotGetJdbcConnectionException ex) {
        log.error("Database connection exception", ex);
        return buildErrorResponse(HttpStatus.SERVICE_UNAVAILABLE, "Database Connection Error",
                "Unable to connect to the database. Please try again later.");
    }

    // Bad SQL Grammar Exception (often from invalid inputs)
    @ExceptionHandler(BadSqlGrammarException.class)
    public ResponseEntity<Map<String, Object>> handleBadSqlGrammarException(BadSqlGrammarException ex) {
        log.error("Bad SQL grammar exception", ex);
        String sql = ex.getSql();
        log.debug("SQL that caused error: {}", sql);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Database Query Error",
                "Invalid database query format. Please check your input parameters.");
    }

    // Generic uncategorized SQL exception
    @ExceptionHandler(UncategorizedSQLException.class)
    public ResponseEntity<Map<String, Object>> handleUncategorizedSQLException(UncategorizedSQLException ex) {
        log.error("Uncategorized SQL exception", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Database Error",
                "An unexpected database error occurred. Please try again later.");
    }

    private ResponseEntity<Map<String, Object>> buildErrorResponse(HttpStatus status, String error, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }



}
