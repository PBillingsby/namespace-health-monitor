# Celestia Namespace Health Monitor

## Overview

The Celestia Namespace Health Monitor is a web application that provides real-time analytics and visualization for Celestia namespaces. It measures the health and activity of namespaces in the Celestia blockchain by analyzing messaging patterns, blob storage, and rollup adoption.

![Celestia Namespace Health Monitor](https://placeholder-image.com/celestia-monitor.png)

## Features

- **Health Score Dashboard**: Comprehensive health metrics with visual indicators
- **Namespace Analytics**: Detailed information about namespace usage and statistics
- **Message Explorer**: Expandable view of recent messages with transaction details
- **Rollup Integration**: View rollups associated with a given namespace
- **Historical Data**: Track health metrics over time with historical charts

## How It Works

### Health Score Calculation

The health score is calculated based on six key metrics, each weighted to reflect its importance:

1. **PFB Ratio (15%)**: Measures the ratio of PayForBlob transactions to total blobs. A higher ratio indicates better economic efficiency.

   ```
   pfbRatio = (namespace.pfb_count / namespace.blobs_count) * 10
   ```

2. **Activity Ratio (25%)**: Assesses how actively the namespace is being used based on message frequency.

   ```
   messagePerDay = namespace.blobs_count / timeSpan
   activityRatio = min(10, messagePerDay / 5)
   ```

3. **Message Frequency (20%)**: Evaluates the consistency of message posting through time gap analysis.

   ```
   messageFrequency = min(10, 10 * exp(-standardDeviation / (1000 * 60 * 60)))
   ```

4. **Version Consistency (10%)**: Checks whether the namespace maintains consistent versions.

   ```
   versionConsistency = max(0, 10 - uniqueVersionsCount)
   ```

5. **Size Stability (20%)**: Evaluates how consistent message sizes are.
   ```
   sizeStability = max(0, 10 - coefficientOfVariation * 10)
   ```

The final score is a weighted sum of these metrics on a scale of 0-10:

```
healthScore = pfbRatio * 0.2 + activityRatio * 0.3 + messageFrequency * 0.2 +
              versionConsistency * 0.1 + sizeStability * 0.2
```

Health statuses are assigned based on score ranges:

- **Excellent**: 8.0 - 10.0
- **Good**: 6.0 - 7.9
- **Fair**: 4.0 - 5.9
- **Poor**: 2.0 - 3.9
- **Critical**: 0.0 - 1.9

## Technical Architecture

### Frontend

- React with TypeScript
- Next.js App Router for server-side rendering
- Chart.js for data visualization
- Tailwind CSS for styling

### API Integration

- Serverless API routes with Next.js
- Integration with Celenium API for Celestia blockchain data
- Pagination for efficient data handling

### Endpoints

- **Get Namespace Info**
  - https://api-mainnet.celenium.io/v1/namespace/{id}
  - Purpose: Retrieves basic information about a namespace
- **Get Namespace Messages**
  - https://api-mainnet.celenium.io/v1/namespace/{id}/{version}/messages?limit={limit}&offset={offset}
  - Purpose: Fetches transaction messages for a namespace with pagination
  - Parameters:
    - `limit`: Number of messages to return
    - `offset`: Pagination offset
- **Get Namespace Rollups**
  - https://api-mainnet.celenium.io/v1/namespace/{id}/{version}/rollups?limit={limit}&offset={offset}
  - Purpose: Retrieves rollups associated with a namespace
  - Parameters:
    - `limit`: Number of messages to return
    - `offset`: Pagination offset

### Key Components

1. **SearchForm**: Handles namespace ID input with formatting
2. **HealthScoreCard**: Displays the health score with visual meter
3. **NamespaceInfoCard**: Shows basic namespace metadata
4. **HealthMetricsChart**: Breaks down individual health metrics
5. **MessagesTable**: Displays paginated transaction data
6. **RollupsTable**: Shows rollups using the namespace

## Demo Tips for Video Recording

When demonstrating the application, consider highlighting these aspects:

1. **Search Functionality**:

   - Show how the app handles both full 56-character namespace IDs and shorter hex strings
   - Example: Search for "eclipse" in hex format (65636c69707365)

2. **Health Metrics Breakdown**:

   - Explain the radar chart showing the six health metrics
   - Point out how each metric contributes to the overall score

3. **Message Exploration**:

   - Demonstrate expanding a message to show transaction details
   - Show pagination through multiple messages
   - Highlight the transaction data visualization

4. **Rollup Integration**:

   - Expand a rollup to show detailed project information
   - Point out links to external resources

5. **API Integration**:
   - Mention how the app connects to the Celenium API
   - Explain that no API key is required

## Implementation Notes

- The application uses client-side pagination for messages to efficiently handle large datasets
- Health calculations are performed server-side to reduce client load
- The UI adapts to different screen sizes with responsive design
- Expandable rows provide detailed information without cluttering the interface
- Color-coding provides intuitive status indication

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Future Enhancements

- Real-time updates with websocket integration
- Additional historical data visualizations
- Export functionality for reports
- Comparative analysis between multiple namespaces
- Integration with other Celestia ecosystem tools
