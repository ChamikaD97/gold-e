import React, { useState } from "react";
import CustomButton from "./CustomButton"; // Adjust the path if needed
import {
  ReloadOutlined,
  DownloadOutlined,
  PlusCircleOutlined,
  MoreOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
const monthOrder = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const MonthRangeSelector = ({ months = [], onRangeChange }) => {
  const [selectedRange, setSelectedRange] = useState({
    start: null,
    end: null,
  });

  // Handle selecting a month, starting a range or completing it.
  const handleMonthSelect = (monthId) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      setSelectedRange({ start: monthId, end: null });
      console.log("First clicked month:", monthId); // Log the first clicked month (start month)
      if (onRangeChange)
        onRangeChange({
          start: monthId,
          end: null,
          firstClicked: selectedRange.start,
        });
    } else if (selectedRange.start === monthId) {



      console.log("Reset clicked month:", monthId); // Log the first clicked month (start month)
      setSelectedRange({ start: null, end: null });
    
    } 
    
    else {
      const newRange = { start: selectedRange.start, end: monthId };
      setSelectedRange(newRange);
      if (onRangeChange)
        onRangeChange({ ...newRange, firstClicked: selectedRange.start });
    }
  };

  // Reset the selected range
  const resetSelection = () => {
    setSelectedRange({ start: null, end: null });
    if (onRangeChange) onRangeChange({ start: null, end: null }); // Reset in parent component
  };

  // Check if a month is within the selected range
  const isInRange = (id) => {
    const startIdx = monthOrder.indexOf(selectedRange.start);
    const endIdx = monthOrder.indexOf(selectedRange.end);
    const idx = monthOrder.indexOf(id);
    if (startIdx === -1 || endIdx === -1) return false; // Return false if start or end is undefined
    const [min, max] = [Math.min(startIdx, endIdx), Math.max(startIdx, endIdx)];
    return idx >= min && idx <= max; // Return true if the month is between start and end
  };

  // Check if a month is the start month (this will help in applying the "start" color)
  const isStartMonth = (monthId) => {
    return selectedRange.start === monthId;
  };

  // Check if a month is before the start month
  const isBeforeStart = (monthId) => {
    return (
      selectedRange.start &&
      !selectedRange.end &&
      monthOrder.indexOf(monthId) < monthOrder.indexOf(selectedRange.start)
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          textAlign: "center",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        {months.map((m) => {
          const inRange = isInRange(m.id); // Check if this month is in the selected range
          const isDisabled = isBeforeStart(m.id); // Disable months before the start
          const isStart = isStartMonth(m.id); // Check if this is the start month

          const style = {
            backgroundColor: inRange ? "#ff4d4f" : isStart ? "#ff4d4f" : "#fff", // Red for months in range, yellow for start month
            border: `1px solid ${
              inRange ? "#ff4d4f" : isStart ? "#ff4d4f" : "#000"
            }`, // Red border for selected months, yellow for start
            color: inRange || isStart ? "#fff" : "#000", // White text for selected months and start
            opacity: isDisabled ? 0.5 : 1, // Reduce opacity for disabled months
            pointerEvents: isDisabled ? "none" : "auto", // Disable pointer events for months before the start
          };

          return (
            <CustomButton
              key={m.id}
              text={m.name}
              onClick={() => handleMonthSelect(m.id)}
              style={style}
            />
          );
        })}
        
      </div>

 
    </div>
  );
};

export default MonthRangeSelector;
