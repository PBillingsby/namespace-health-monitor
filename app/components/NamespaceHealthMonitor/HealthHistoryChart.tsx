import React from "react";
import { Line } from "react-chartjs-2";
import { HistoricalHealth } from "../../types/namespace";
import { getHealthHistoryChartData } from "../../utils/formatters";
import { Info } from "lucide-react";

interface HealthHistoryChartProps {
  historicalHealth: HistoricalHealth[];
}

const HealthHistoryChart: React.FC<HealthHistoryChartProps> = ({
  historicalHealth,
}) => {
  if (historicalHealth.length < 1) return null;
  const chartData = getHealthHistoryChartData(historicalHealth);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Health History</h2>
        <div className="group relative">
          <div className="flex items-center cursor-help text-gray-500 hover:text-blue-500">
            <Info size={16} />
          </div>
          <div className="absolute right-0 hidden group-hover:block w-64 p-2 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
            This chart tracks health score changes during your current session.
            Each point represents a recalculation of the health score.
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Tracks health score changes as you interact with the dashboard
      </p>

      <div className="h-64">
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                min: 0,
                max: 10,
                title: {
                  display: true,
                  text: "Health Score",
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default HealthHistoryChart;
