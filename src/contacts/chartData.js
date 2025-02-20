import { useState } from "react";

// chart options
export const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Rotation vs Time Graph" },
      zoom: {
        pan: { enabled: true, mode: "xy" },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "xy",
        },
      },
    },
    scales: {
      x: { type: "linear", title: { display: true, text: "Time ( s )" } },
      y: { type: "linear", title: { display: true, text: "Position ( m )" } },
    },
  };

// custom hooks for chart state
export const useChartData = ()=>{
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: "Box Rotation",
            data: [],
            borderColor: "blue",
            tension: 0,
            fill: false,
        }],
  });
  return { chartData, setChartData};
};