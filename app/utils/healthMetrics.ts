import { NamespaceInfo, NamespaceMessage, HealthMetrics } from '../types/namespace';
import { HEALTH_METRIC_WEIGHTS, HEALTH_STATUS, HEALTH_COLORS } from '../constants';

// Calculate health metrics
export function calculateHealthMetrics(
  info: NamespaceInfo,
  messages: NamespaceMessage[],
): HealthMetrics {
  // 1. PFB Ratio: Percentage of PayForBlob transactions relative to blob count
  const pfbRatio = info.blobs_count > 0 
    ? (info.pfb_count / info.blobs_count) * 10 
    : 0;

  // 2. Activity Ratio: How actively the namespace is being used
  let firstTime = new Date().getTime();
  if (messages.length > 0) {
    // Find the oldest message timestamp
    firstTime = messages.reduce((oldest, msg) => {
      const msgTime = new Date(msg.time).getTime();
      return msgTime < oldest ? msgTime : oldest;
    }, new Date().getTime());
  }

  const lastTime = new Date(info.last_message_time).getTime();
  const timeSpan = (lastTime - firstTime) / (1000 * 60 * 60 * 24); // days
  const messagePerDay = timeSpan > 0 ? info.blobs_count / timeSpan : 0;
  const activityRatio = Math.min(10, messagePerDay / 5); // Assuming 5 messages/day is a good baseline

  // 3. Message Frequency: How regularly messages are posted
  const timeGaps: number[] = [];
  for (let i = 1; i < messages.length; i++) {
    const current = new Date(messages[i].time).getTime();
    const previous = new Date(messages[i - 1].time).getTime();
    timeGaps.push(current - previous);
  }

  let avgGap = 0;
  if (timeGaps.length > 0) {
    avgGap = timeGaps.reduce((sum, gap) => sum + gap, 0) / timeGaps.length;
  }

  let stdDev = 0;
  if (timeGaps.length > 0) {
    const squaredDiffs = timeGaps.map((gap) => Math.pow(gap - avgGap, 2));
    const avgSquaredDiff =
      squaredDiffs.reduce((sum, diff) => sum + diff, 0) /
      squaredDiffs.length;
    stdDev = Math.sqrt(avgSquaredDiff);
  }

  // Lower standard deviation means more consistent posting - better health
  const messageFrequency = stdDev > 0
    ? Math.min(10, 10 * Math.exp(-stdDev / (1000 * 60 * 60)))
    : 10; // Scale by hour

  // 4. Version Consistency: Are there many versions or is it consistent?
  const uniqueVersions = new Set(messages.map((m) => m.version)).size;
  const versionConsistency = Math.max(0, 10 - uniqueVersions); // Fewer versions is better

  // 5. Size Stability: How consistent is the message size?
  const sizes = messages.map((m) => m.size);
  const avgSize = sizes.length > 0 
    ? sizes.reduce((sum, size) => sum + size, 0) / sizes.length
    : 0;
    
  const sizeVariance = sizes.length > 0
    ? sizes.reduce((sum, size) => sum + Math.pow(size - avgSize, 2), 0) / sizes.length
    : 0;
    
  const sizeCoeffVar = avgSize > 0 ? Math.sqrt(sizeVariance) / avgSize : 0;
  const sizeStability = Math.max(0, 10 - sizeCoeffVar * 10); // Lower variance is better

  return {
    pfbRatio,
    activityRatio,
    messageFrequency,
    versionConsistency,
    sizeStability,
  };
}

// Calculate overall health score
export function calculateHealthScore(metrics: HealthMetrics): number {
  // Weighted sum
  const score =
    metrics.pfbRatio * HEALTH_METRIC_WEIGHTS.pfbRatio +
    metrics.activityRatio * HEALTH_METRIC_WEIGHTS.activityRatio +
    metrics.messageFrequency * HEALTH_METRIC_WEIGHTS.messageFrequency +
    metrics.versionConsistency * HEALTH_METRIC_WEIGHTS.versionConsistency +
    metrics.sizeStability * HEALTH_METRIC_WEIGHTS.sizeStability;

  return Math.round(score * 10) / 10; // Round to 1 decimal place
}

// Function to determine health status
export function determineHealthStatus(score: number): string {
  if (score >= 8) return HEALTH_STATUS.EXCELLENT;
  if (score >= 6) return HEALTH_STATUS.GOOD;
  if (score >= 4) return HEALTH_STATUS.FAIR;
  if (score >= 2) return HEALTH_STATUS.POOR;
  return HEALTH_STATUS.CRITICAL;
}

// Health score color
export function getHealthScoreColor(score: number): string {
  if (score >= 8) return HEALTH_COLORS.EXCELLENT;
  if (score >= 6) return HEALTH_COLORS.GOOD;
  if (score >= 4) return HEALTH_COLORS.FAIR;
  if (score >= 2) return HEALTH_COLORS.POOR;
  return HEALTH_COLORS.CRITICAL;
}