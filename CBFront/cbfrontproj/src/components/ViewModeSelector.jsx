// src/components/ViewModeSelector.jsx
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";

function ViewModeSelector({ viewMode, onChange }) {
  return (
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={onChange}
      size="small"
      aria-label="View Mode"
    >
      <ToggleButton value="bar" aria-label="Bar Chart View">
        <BarChartIcon />
      </ToggleButton>
      <ToggleButton value="line" aria-label="Line Chart View">
        <ShowChartIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

export default ViewModeSelector;