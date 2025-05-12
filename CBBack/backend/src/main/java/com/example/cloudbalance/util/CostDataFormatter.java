package com.example.cloudbalance.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CostDataFormatter {

    /**
     * Formats raw cost data with a single groupBy field
     *
     * @param data The raw data from the database
     * @param frontendKey The frontend field name (e.g., "Services")
     * @param backendKey The backend field name (e.g., "PRODUCT_PRODUCTNAME")
     * @return Formatted list of data with frontend keys
     */
    public static List<Map<String, Object>> format(List<Map<String, Object>> data, String frontendKey, String backendKey) {
        List<Map<String, Object>> formattedData = new ArrayList<>();

        for (Map<String, Object> row : data) {
            Map<String, Object> formattedRow = new HashMap<>();

            // Extract and format the date (month)
            formattedRow.put("month", row.get("USAGE_MONTH"));

            // Extract and format the cost
            formattedRow.put("cost", row.get("TOTAL_USAGE_COST"));

            // Extract and format the grouped field using the frontend key name
            formattedRow.put(frontendKey, row.get(backendKey));

            formattedData.add(formattedRow);
        }

        return formattedData;
    }
}