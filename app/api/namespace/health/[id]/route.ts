import { NextResponse } from 'next/server';
import { NamespaceInfo, NamespaceMessage, RollupInfo, HealthMetrics } from '../../../../types/namespace';

const API_BASE_URL = "https://api-mainnet.celenium.io/v1";

function calculateHealthMetrics(
  info: NamespaceInfo,
  messages: NamespaceMessage[],
): HealthMetrics {

  const pfbRatio = info.pfb_count > 0
    ? Math.min(10, (info.blobs_count / info.pfb_count) * 2)
    : 0;

  let firstTime = new Date().getTime();
  if (messages.length > 0) {
    firstTime = messages.reduce((oldest, msg) => {
      const msgTime = new Date(msg.time).getTime();
      return msgTime < oldest ? msgTime : oldest;
    }, new Date().getTime());
  }

  const lastTime = new Date(info.last_message_time).getTime();
  const timeSpan = (lastTime - firstTime) / (1000 * 60 * 60 * 24); // days
  const messagePerDay = timeSpan > 0 ? info.blobs_count / timeSpan : 0;
  const activityRatio = Math.min(10, messagePerDay / 5); // Assuming 5 messages/day is a good baseline

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

  const messageFrequency = stdDev > 0
    ? Math.min(10, 10 * Math.exp(-stdDev / (1000 * 60 * 60)))
    : 10;

  const uniqueVersions = new Set(messages.map((m) => m.version)).size;
  const versionConsistency = Math.max(0, 10 - uniqueVersions); // Fewer versions is better

  const sizes = (messages ?? [])
    .map((m) => m.size)
    .filter((size): size is number => typeof size === 'number');  

  const avgSize = sizes.length > 0 
    ? sizes?.reduce((sum, size) => sum + size, 0) / sizes.length
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

// Modified to match the display value
function calculateHealthScore(metrics: HealthMetrics): number {
  // Use the same formula for both the display and the health score
  const simpleAverage = (
    metrics.pfbRatio +
    metrics.activityRatio +
    metrics.messageFrequency +
    metrics.versionConsistency +
    metrics.sizeStability
  ) / 5;
  
  return Math.round(simpleAverage * 10) / 10;
}

function determineHealthStatus(score: number): string {
  if (score >= 8) return "Excellent";
  if (score >= 6) return "Good";
  if (score >= 4) return "Fair";
  if (score >= 2) return "Poor";
  return "Critical";
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await Promise.resolve(params);  
  try {
    // 1. Fetch namespace info
    const infoResponse = await fetch(`${API_BASE_URL}/namespace/${id}`);
    if (!infoResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch namespace info: ${infoResponse.status}` },
        { status: infoResponse.status }
      );
    }
    const infoData = await infoResponse.json();
    const info = infoData[0] || null;
    
    if (!info) {
      return NextResponse.json(
        { error: "Namespace not found" },
        { status: 404 }
      );
    }

    // 2. Fetch namespace messages
    const messagesResponse = await fetch(
      `${API_BASE_URL}/namespace/${id}/0/messages`
    );
    if (!messagesResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch namespace messages: ${messagesResponse.status}` },
        { status: messagesResponse.status }
      );
    }
    const messages = await messagesResponse.json() || [];

    // 3. Fetch rollups using the namespace
    let rollups: RollupInfo[] = [];
    try {
      const rollupsResponse = await fetch(
        `${API_BASE_URL}/namespace/${id}/0/rollups?limit=10&offset=0`
      );

      if (rollupsResponse.ok) {
        rollups = await rollupsResponse.json() || [];
      }
    } catch (error) {
      console.error("Error fetching rollups (non-critical):", error);
    }

    // 4. Calculate health metrics
    const metrics = calculateHealthMetrics(info, messages, rollups);

    // 5. Calculate overall health score
    const score = calculateHealthScore(metrics);

    // 6. Determine health status
    const status = determineHealthStatus(score);

    // 7. Return the health assessment
    return NextResponse.json({
      namespaceInfo: info,
      healthScore: score,
      healthStatus: status,
      healthMetrics: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error calculating namespace health:", error);
    return NextResponse.json(
      { error: "Failed to calculate namespace health" },
      { status: 500 }
    );
  }
}