package com.example.cloudbalance.util;

import com.example.cloudbalance.dto.CostExplorerRequestDto;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class SqlQueries {
    public static String buildQuery(CostExplorerRequestDto request) {
        StringBuilder query = new StringBuilder();

        // Default groupBy column
        String groupByColumn = request.getGroupBy() != null && !request.getGroupBy().isEmpty()
                ? request.getGroupBy()
                : "PRODUCT_PRODUCTNAME";

        query.append("SELECT TO_CHAR(USAGESTARTDATE, 'YYYY-MM') AS USAGE_MONTH, ")
                .append(groupByColumn).append(", SUM(LINEITEM_USAGEAMOUNT) AS TOTAL_USAGE_COST ")
                .append("FROM COST_EXPLORER WHERE 1=1 ");

        // Add filters if present
        if (request.getFilters() != null && !request.getFilters().isEmpty()) {
            for (String filter : request.getFilters()) {
                query.append(" AND ").append(filter).append(" ");
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        // Add date range if provided
        if (request.getStartDate() != null && request.getEndDate() != null) {
            query.append("AND USAGESTARTDATE BETWEEN TO_DATE('")
                    .append(request.getStartDate())
                    .append("') AND TO_DATE('")
                    .append(request.getEndDate())
                    .append("') ");
        }
        else {
            // Default to last 30 days if no date range provided
            LocalDate endDate = LocalDate.now();
            LocalDate startDate = endDate.minusMonths(1);

            query.append("AND USAGESTARTDATE BETWEEN TO_DATE('")
                    .append(startDate.format(formatter))
                    .append("') AND TO_DATE('")
                    .append(endDate.format(formatter))
                    .append("') ");
        }


        query.append("GROUP BY TO_CHAR(USAGESTARTDATE, 'YYYY-MM'), ")
                .append(groupByColumn).append(" ")
                .append("ORDER BY USAGE_MONTH, TOTAL_USAGE_COST DESC");

        return query.toString();
    }
}