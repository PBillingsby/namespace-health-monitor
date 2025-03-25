export const API_BASE_URL = "https://api-mainnet.celenium.io/v1";

export const HEALTH_STATUS = {
  EXCELLENT: "Excellent",
  GOOD: "Good",
  FAIR: "Fair",
  POOR: "Poor",
  CRITICAL: "Critical"
};

export const HEALTH_COLORS = {
  EXCELLENT: "#4CAF50", // Green
  GOOD: "#8BC34A",      // Light Green
  FAIR: "#FFC107",      // Amber
  POOR: "#FF9800",      // Orange
  CRITICAL: "#F44336"   // Red
};

export const HEALTH_METRIC_WEIGHTS = {
  pfbRatio: 0.15,
  activityRatio: 0.25,
  messageFrequency: 0.2,
  versionConsistency: 0.1,
  sizeStability: 0.2,
};