"use client";

import React, { useState, useEffect } from "react";
import useNamespaceData from "../../hooks/useNamespaceData";

import SearchForm from "./SearchForm";
import ErrorDisplay from "../common/ErrorDisplay";
import HealthScoreCard from "./HealthScoreCard";
import NamespaceInfoCard from "./NamespaceInfoCard";
import HealthMetricsChart from "./HealthMetricsChart";
import HealthHistoryChart from "./HealthHistoryChart";
import RollupsTable from "./RollupsTable";
import MessagesTable from "./MessagesTable";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const NamespaceHealthMonitor: React.FC = () => {
  const [namespaceId, setNamespaceId] = useState<string>("");
  const {
    namespaceInfo,
    namespaceMessages,
    rollupsInfo,
    healthScore,
    healthStatus,
    healthMetrics,
    historicalHealth,
    loading,
    error,
    checkNamespaceHealth,
    totalMessages,
    fetchMoreMessages,
    loadingMoreMessages,
  } = useNamespaceData();

  const handleNamespaceSubmit = (id: string) => {
    setNamespaceId(id);
    checkNamespaceHealth(id);
  };

  const handlePageChange = async (offset: number, limit: number) => {
    await fetchMoreMessages(offset, limit);
  };

  useEffect(() => {
    if (namespaceId) {
      checkNamespaceHealth(namespaceId);
    }
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto text-black">
      {/* Search Form */}
      <SearchForm
        defaultValue={namespaceId}
        onSubmit={handleNamespaceSubmit}
        isLoading={loading}
      />

      {error && <ErrorDisplay message={error} />}

      {namespaceInfo ? (
        <div className="space-y-6">
          <HealthScoreCard score={healthScore} status={healthStatus} />

          <NamespaceInfoCard info={namespaceInfo} />

          <HealthMetricsChart metrics={healthMetrics} />

          <HealthHistoryChart historicalHealth={historicalHealth} />

          <RollupsTable rollups={rollupsInfo} />

          <MessagesTable
            messages={namespaceMessages}
            totalMessages={totalMessages}
            pageSize={10}
            onPageChange={handlePageChange}
            isLoading={loadingMoreMessages}
          />
        </div>
      ) : (
        <div className="bg-inherit p-8 rounded-lg shadow text-center space-y-4">
          <p className="text-white max-w-md mx-auto">
            Enter a Celestia namespace ID above to analyze its health and
            activity metrics.
          </p>
        </div>
      )}
    </div>
  );
};

export default NamespaceHealthMonitor;
