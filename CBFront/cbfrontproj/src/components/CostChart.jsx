// CostExplorerChart.jsx
import { useEffect, useState } from "react";

// Import FusionCharts
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import ReactFC from 'react-fusioncharts';

// Initialize FusionCharts with dependencies
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

function CostChart({ 
  costData,
  months,
  viewMode,
  selectedGroupBy,
  dateRange,
  includeNegative 
}) {
  const [chartConfig, setChartConfig] = useState(null);


  const formatMonth = (monthStr) => {
    if (!monthStr) return '';
    
    try {
     
      const [year, month] = monthStr.split('-');
      
     
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      const monthIndex = parseInt(month, 10) - 1;
      return `${monthNames[monthIndex]} ${year}`;
    } catch (error) {
      console.error("Error formatting month:", error);
      return monthStr;
    }
  };


  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    
    try {
     
      const [year, month, day] = dateStr.split('-');
      
     
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      
      const monthIndex = parseInt(month, 10) - 1;
      return `${day}-${monthNames[monthIndex]}-${year}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

 
  const generateChartConfig = () => {
    if (costData.length === 0 || months.length === 0) return;
    
    // Prepare categories for x-axis (months)
    const categories = months.map(month => ({
      label: formatMonth(month)
    }));
    
    const colorPalette = [
      "#2196F3", // bright blue
      "#4CAF50", // bright green
      "#FFEB3B", // bright yellow
      "#FF9800", // bright orange
      "#F44336", // bright red
      "#9C27B0"  // bright purple (for "Others")
    ];
    
  
    const sortedData = [...costData].sort((a, b) => b.total - a.total);
    
  
    const top5Data = sortedData.slice(0, 5);
 
    const otherData = sortedData.slice(5);
    
 
    let dataset = [];
    

    top5Data.forEach((row, index) => {
      const data = months.map(month => {
        const value = row[month] || 0;
  
        if (!includeNegative && value < 0) return null;
        return {
          value: value.toFixed(2)
        };
      });
      
      dataset.push({
        seriesname: row[selectedGroupBy] || "Unnamed",
        color: colorPalette[index],
        data
      });
    });
    
    // Process "Others" category if there are any items beyond the top 5
    if (otherData.length > 0) {
      // Initialize values for each month
      const otherValues = {};
      months.forEach(month => {
        otherValues[month] = 0;
      });
      
      // Sum up values for each month across all other items
      otherData.forEach(row => {
        months.forEach(month => {
          const value = row[month] || 0;
          // Only add positive values if includeNegative is false
          if (includeNegative || value >= 0) {
            otherValues[month] += value;
          }
        });
      });
      
      // Create data points for "Others" category
      const otherDataPoints = months.map(month => ({
        value: otherValues[month].toFixed(2)
      }));
      
      // Add "Others" to the dataset
      dataset.push({
        seriesname: "Others",
        color: colorPalette[5], // Use the 6th color for "Others"
        data: otherDataPoints
      });
    }
    
    // Configure chart to match the image but with better sizing
    let chartConfigObj = {
      type: viewMode === "line" ? "msline" : "mscolumn2d", // Use mscolumn2d for bar chart
      width: "100%",
      height: "400", // Return to original height
      dataFormat: "json",
      dataSource: {
        chart: {
          xAxisName: "Months",
          yAxisName: "Cost ($)",
          theme: "fusion",
          showValues: "0",
          drawCrossLine: "0",
          showLegend: "1",
          legendPosition: "bottom",
          plotToolText: "<b>$seriesName</b><br>$label: $dataValue",
          numberPrefix: "$",
          formatNumberScale: "0",
          showPlotBorder: "0",
          usePlotGradientColor: "0",
          showHoverEffect: "1",
          showShadow: "0",
          canvasBgColor: "#FFFFFF",
          canvasBgAlpha: "0",
          
         
          placeValuesInside: "0",
          showAlternateHGridColor: "0",
          showAlternateVGridColor: "0",
          
          // X-axis styling
          xAxisLineColor: "#CCCCCC",
          xAxisLineThickness: "3",
          
          // Y-axis styling
          yAxisLineColor: "#CCCCCC",
          yAxisLineThickness: "3",
          
         
          paletteColors: colorPalette.join(","),
          plotSpacePercent: "80", 
          plotFillAlpha: "100", 
          
    
          maxColWidth: "6", 
          
        
          divLineColor: "#EEEEEE",
          divLineThickness: "3",
          divLineAlpha: "70",
          
       
          showBorder: "0"
        },
        categories: [{
          category: categories
        }],
        dataset
      }
    };
    
    setChartConfig(chartConfigObj);
  };


  useEffect(() => {
    if (costData.length > 0 && months.length > 0) {
      generateChartConfig();
    }
  }, [costData, months, viewMode, selectedGroupBy, dateRange, includeNegative]);

 
  if (!chartConfig) {
    return null;
  }

  return <ReactFC {...chartConfig} />;
}

export default CostChart;