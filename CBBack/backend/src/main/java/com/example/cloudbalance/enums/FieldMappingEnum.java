package com.example.cloudbalance.enums;

import java.util.HashMap;
import java.util.Map;

public enum FieldMappingEnum {
    PRODUCT_NAME("Services", "PRODUCT_PRODUCTNAME"),
    INSTANCE_TYPE("Instance_Type", "MYCLOUD_INSTANCETYPE"),
    ACCOUNT_ID("Account_id", "LINKEDACCOUNTID"),
    USAGE_TYPE("Usage_Type", "LINEITEM_USAGETYPE"),
    OPERATION("Operation", "LINEITEM_OPERATION"),
    REGION("Region", "MYCLOUD_REGIONNAME"),
    AVAILABILITY_ZONE("Availability_Zone", "AVAILABILITYZONE"),
    TENANCY("Tenancy", "TENANCY"),
    OPERATING_SYSTEM("Operating_System", "MYCLOUD_OPERATINGSYSTEM"),
    PRICING_TYPE("Pricing_Type", "MYCLOUD_PRICINGTYPE"),
    USAGE_START_DATE("Usage_Start_Date", "USAGESTARTDATE"),
    DATABASE_ENGINE("Database_Engine", "PRODUCT_DATABASEENGINE"),
    UNBLENDED_COST("Unblended_Cost", "LINEITEM_UNBLENDEDCOST"),
    USAGE_AMOUNT("Usage_Amount", "LINEITEM_USAGEAMOUNT"),
    COST_EXPLORER_USAGE_GROUP_TYPE("Cost_Explorer_Usage_Group_Type", "MYCLOUD_COST_EXPLORER_USAGE_GROUP_TYPE"),
    PRICING_UNIT("Pricing_Unit", "PRICING_UNIT"),
    CHARGE_TYPE("Charge_Type", "CHARGE_TYPE");



    private final String frontendName;
    private final String backendName;

    FieldMappingEnum(String frontendName, String backendName) {
        this.frontendName = frontendName;
        this.backendName = backendName;
    }

    public String getFrontendName() {
        return frontendName;
    }

    public String getBackendName() {
        return backendName;
    }

    // Map for quick frontend -> backend lookup
    private static final Map<String, String> frontendToBackendMap = new HashMap<>();

    static {
        for (FieldMappingEnum field : values()) {
            frontendToBackendMap.put(field.frontendName, field.backendName);
        }
    }

    public static String getBackendNameFromFrontend(String frontendName) {
        return frontendToBackendMap.getOrDefault(frontendName, frontendName);
    }

    public static String getFrontendNameFromBackend(String backendName) {
        for (FieldMappingEnum field : values()) {
            if (field.backendName.equalsIgnoreCase(backendName)) {
                return field.frontendName;
            }
        }
        return backendName;
    }
}
