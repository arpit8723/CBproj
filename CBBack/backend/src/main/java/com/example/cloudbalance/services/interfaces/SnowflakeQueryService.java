package com.example.cloudbalance.services.interfaces;

import com.example.cloudbalance.dto.CostExplorerRequestDto;

import java.util.List;
import java.util.Map;

public interface SnowflakeQueryService {
    List<Map<String, Object>> getCostData(String accountNumber, CostExplorerRequestDto request);

    List<String> getDistinctValuesForField(String backendField);
}