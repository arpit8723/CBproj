package com.example.cloudbalance.exception;

import org.springframework.http.HttpStatus;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class SnowflakeErrorHandler {


    public static HttpStatus mapErrorToHttpStatus(int vendorCode, String sqlState) {
        switch (vendorCode) {
            case 2003: // Column not found
            case 2043: // Object does not exist
            case 2201: // Table not found
                return HttpStatus.BAD_REQUEST;

            case 90030: // Invalid table name
            case 90080: // Invalid column name
                return HttpStatus.BAD_REQUEST;

            case 1043: // Invalid parameter value
            case 90110: // Invalid input
                return HttpStatus.BAD_REQUEST;

            case 604: // Statement timeout
            case 615: // Connection timeout
                return HttpStatus.GATEWAY_TIMEOUT;

            case 390100: // Authorization error
            case 390103: // Insufficient privileges
                return HttpStatus.FORBIDDEN;

            case 300001: // Connection failed
            case 300003: // Failed login
                return HttpStatus.SERVICE_UNAVAILABLE;

            case 91011: // Snowflake internal error
                return HttpStatus.SERVICE_UNAVAILABLE;

            default:
                if (sqlState != null) {
                    if (sqlState.startsWith("42")) {  // Syntax error or access rule violation
                        return HttpStatus.BAD_REQUEST;
                    } else if (sqlState.startsWith("08")) {  // Connection exception
                        return HttpStatus.SERVICE_UNAVAILABLE;
                    } else if (sqlState.startsWith("57")) {  // Operator intervention (e.g. for shutdown)
                        return HttpStatus.SERVICE_UNAVAILABLE;
                    }
                }

                // Default for unknown errors
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }
    }


    public static String createUserFriendlyMessage(String originalMessage, int errorCode) {

        switch (errorCode) {
            case 2003:
                return "The requested column was not found. Please check your filter parameters.";
            case 2043:
            case 2201:
                return "The requested data was not found. Please check your query parameters.";
            case 1043:
            case 90080:
            case 90110:
                return "Invalid input parameter provided. Please check your request.";
            case 604:
            case 615:
                return "The query took too long to complete. Please try with a shorter date range or fewer filters.";
            case 390100:
            case 390103:
                return "You don't have permission to access this data. Please contact an administrator.";
            case 300001:
            case 300003:
                return "Unable to connect to the database. Please try again later.";
            case 91011:
                return "An internal database error occurred. Our team has been notified.";
            default:
                log.debug("Unmapped Snowflake error code: {} with message: {}", errorCode, originalMessage);
                return "An error occurred while processing your request. Please try again later.";
        }
    }

    public static void logSnowflakeError(int errorCode, String sqlState, String message, Throwable exception) {
        log.error("Snowflake error occurred - Error code: {}, SQL State: {}, Message: {}",
                errorCode, sqlState, message, exception);
    }
}