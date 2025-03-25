import { format } from 'date-fns';
import { HistoricalHealth, HealthMetrics } from '../types/namespace';
import { ChartData } from 'chart.js';

// Format graph data for health history
export function getHealthHistoryChartData(historicalHealth: HistoricalHealth[]): ChartData<'line'> {
  return {
    labels: historicalHealth.map((point) =>
      format(new Date(point.timestamp), "HH:mm:ss")
    ),
    datasets: [
      {
        label: "Health Score",
        data: historicalHealth.map((point) => point.healthScore),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };
}

// Format graph data for metrics breakdown
export function getMetricsBreakdownChartData(healthMetrics: HealthMetrics | null): ChartData<'bar'> | null {
  if (!healthMetrics) return null;
  return {
    labels: [
      "PFB Ratio",
      "Activity",
      "Message Frequency",
      "Version Consistency",
      "Size Stability",
    ],
    datasets: [
      {
        label: "Health Metrics",
        data: [
          healthMetrics.pfbRatio,
          healthMetrics.activityRatio,
          healthMetrics.messageFrequency,
          healthMetrics.versionConsistency,
          healthMetrics.sizeStability,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };
}

// Format date for display
export function formatDate(dateString: string): string {
  return format(new Date(dateString), "PPP");
}

// Format time for display
export function formatDateTime(dateString: string): string {
  return format(new Date(dateString), "PPp");
}

export const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  else if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  else if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  else return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};