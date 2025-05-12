package com.example.cloudbalance.services.impl;

import com.example.cloudbalance.dto.CostExplorerRequestDto;
import com.example.cloudbalance.enums.FieldMappingEnum;
import com.example.cloudbalance.repository.SnowflakeRepository;
import com.example.cloudbalance.services.interfaces.SnowflakeQueryService;
import com.example.cloudbalance.util.CostDataFormatter;
import com.example.cloudbalance.util.SqlQueries;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class SnowflakeQueryServiceImpl implements SnowflakeQueryService {

    @Autowired
    private SnowflakeRepository snowflakeRepository;

    private final JdbcTemplate jdbcTemplate;

    public SnowflakeQueryServiceImpl(@Qualifier("snowflakeJdbcTemplate") JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Map<String, Object>> getCostData(String accountNumber, CostExplorerRequestDto request) {
        if (request != null) {

            // Handle groupBy field translation
            if (request.getGroupBy() != null) {
                String backendGroupBy = FieldMappingEnum.getBackendNameFromFrontend(request.getGroupBy());
                request.setGroupBy(backendGroupBy);
            }

            // Handle filters
            if (request.getFilters() != null) {
                for (int i = 0; i < request.getFilters().size(); i++) {
                    String filter = request.getFilters().get(i);
                    String[] filterParts = filter.split(" ");
                    if (filterParts.length >= 3) {
                        String field = filterParts[0];
                        String backendField = FieldMappingEnum.getBackendNameFromFrontend(field);
                        filter = filter.replace(field, backendField);
                    }
                    request.getFilters().set(i, filter);
                }
            }
        }

        String query = SqlQueries.buildQuery(request);

        // Apply account number filter if not already in the query
        if (!query.contains("LINKEDACCOUNTID")) {
            query = query.replace("WHERE 1=1", "WHERE LINKEDACCOUNTID = '" + accountNumber + "'");
        }

        List<Map<String, Object>> rawData = snowflakeRepository.fetchCostData(accountNumber, query);

        // Get the frontend field name for the groupBy
        String groupByBackendKey = request.getGroupBy();
        String groupByFrontendKey = FieldMappingEnum.getFrontendNameFromBackend(groupByBackendKey);

        return CostDataFormatter.format(rawData, groupByFrontendKey, groupByBackendKey);
    }

    @Override
    public List<String> getDistinctValuesForField(String backendField) {
        String query = String.format("SELECT DISTINCT %s FROM COST_EXPLORER WHERE %s IS NOT NULL", backendField, backendField);
        return jdbcTemplate.queryForList(query, String.class);
    }
}