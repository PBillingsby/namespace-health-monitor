import React from "react";
import { getHealthScoreColor } from "../../utils/healthMetrics";

interface HealthScoreCardProps {
  score: number;
  status: string;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({ score, status }) => {
  const scoreColor = getHealthScoreColor(score);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2">Namespace Health</h2>
      <div className="flex items-center gap-4">
        <div className="text-5xl font-bold" style={{ color: scoreColor }}>
          {score.toFixed(1)}/10
        </div>
        <div className="text-2xl">{status}</div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="h-4 rounded-full"
            style={{
              width: `${score * 10}%`,
              backgroundColor: scoreColor,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
