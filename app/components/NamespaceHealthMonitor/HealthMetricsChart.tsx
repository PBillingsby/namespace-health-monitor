import React from "react";
import { Bar } from "react-chartjs-2";
import { HealthMetrics } from "../../types/namespace";
import { getMetricsBreakdownChartData } from "../../utils/formatters";
import { Info } from "lucide-react";

const formatScore = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  } else {
    return value.toFixed(1);
  }
};

const metricExplanations: { [key: string]: string } = {
  "PFB Ratio":
    "Measures the ratio of PayForBlob transactions to total blobs. Higher ratio indicates better economic efficiency.",
  Activity:
    "Evaluates how actively the namespace is being used based on message frequency over time.",
  "Message Frequency":
    "Analyzes consistency of message posting through statistical analysis of time gaps.",
  "Version Consistency":
    "Examines whether the namespace maintains consistent versions. Fewer version changes is better.",
  "Size Stability":
    "Measures the consistency of message sizes. Lower variance indicates more predictable usage.",
};

interface HealthMetricsChartProps {
  metrics: HealthMetrics | null;
}

const HealthMetricsChart: React.FC<HealthMetricsChartProps> = ({ metrics }) => {
  if (!metrics) return null;

  const chartData = getMetricsBreakdownChartData(metrics);
  if (!chartData) return null;

  const avgScore =
    (metrics.pfbRatio +
      metrics.activityRatio +
      metrics.messageFrequency +
      metrics.versionConsistency +
      metrics.sizeStability) /
    5;

  const averageScore = formatScore(avgScore);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Health Metrics Breakdown</h2>
        <div className="text-sm font-medium text-gray-600">
          Average: {averageScore}/10
        </div>
      </div>

      <div className="flex items-center mb-4">
        <p className="text-sm text-gray-500">
          Each metric is scored from 0-10, with higher values indicating better
          health
        </p>
        <div className="group relative ml-2">
          <div className="flex items-center cursor-help text-gray-500 hover:text-blue-500">
            <Info size={16} />
          </div>
          <div className="absolute left-0 hidden group-hover:block w-72 p-3 bg-gray-800 text-white text-xs rounded shadow-lg z-10">
            <h4 className="font-bold mb-2">Metrics Explanation:</h4>
            <ul className="space-y-2">
              {Object.entries(metricExplanations).map(
                ([metric, explanation]) => (
                  <li key={metric}>
                    <span className="font-semibold">{metric}:</span>{" "}
                    {explanation}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="h-80">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                title: {
                  display: true,
                  text: "Score (0-10)",
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    if (typeof context.raw === "number") {
                      const formattedValue = formatScore(context.raw);
                      return `Score: ${formattedValue}/10`;
                    }

                    return `Score: ${context.raw}/10`;
                  },
                  afterLabel: function (context) {
                    const metricLabel = context.label || "";
                    return metricExplanations[metricLabel] || "";
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default HealthMetricsChart;
