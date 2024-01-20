import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function MufChart({ chartData, onPointClick }) {
  const handleClick = (evt, item) => {
    if (item.length > 0) {
      const index = item[0].index;
      const pointData = {
        time: chartData.labels[index],
        muf: chartData.datasets[0].data[index],
      };
      onPointClick(pointData);
    }
  };

  return (
    <Line
      data={chartData}
      options={{
        plugins: {
          tooltip: { enabled: true, displayColors: false },
        },
        onClick: handleClick,
      }}
    />
  );
}

export default MufChart;
