package com.example.cloudbalance.controller;


import com.example.cloudbalance.dto.ColumnOptionsResponseDto;
import com.example.cloudbalance.dto.CostExplorerRequestDto;
import com.example.cloudbalance.enums.FieldMappingEnum;
import com.example.cloudbalance.services.interfaces.SnowflakeQueryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class CostExplorerController {
    private final SnowflakeQueryService snowflakeQueryService;

    public CostExplorerController(SnowflakeQueryService snowflakeQueryService) {
        this.snowflakeQueryService = snowflakeQueryService;
    }

    @PostMapping("/getcost/{accountNumber}")
    public ResponseEntity<?> getCostExplorerData(
            @PathVariable String accountNumber,
            @RequestBody(required = false) CostExplorerRequestDto request
    ) {
        List<Map<String, Object>> processedData = snowflakeQueryService.getCostData(accountNumber, request);
        return ResponseEntity.ok(processedData);
    }

    @GetMapping("/api/costexplorer/columns")
    public ColumnOptionsResponseDto getAllColumns() {
        List<String> columns = Arrays.stream(FieldMappingEnum.values())
                .map(FieldMappingEnum::getFrontendName)
                .collect(Collectors.toList());

        return new ColumnOptionsResponseDto(columns);
    }

        @GetMapping("/distinct-values")
    public ResponseEntity<List<String>> getDistinctValues(@RequestParam String field) {
        String backendField = FieldMappingEnum.getBackendNameFromFrontend(field);
        List<String> distinctValues = snowflakeQueryService.getDistinctValuesForField(backendField);
        return ResponseEntity.ok(distinctValues);
    }

}
