import React from "react";
import { RollupInfo } from "../../types/namespace";
import RollupRow from "./RollupRow";

interface RollupsTableProps {
  rollups: RollupInfo[];
}

const RollupsTable: React.FC<RollupsTableProps> = ({ rollups }) => {
  if (rollups.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Associated Rollups</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Project Name</th>
              <th className="px-4 py-2 text-left">Website</th>
              <th className="px-4 py-2 text-left">Twitter</th>
            </tr>
          </thead>
          <tbody>
            {rollups.map((rollup, index) => (
              <RollupRow key={index} rollup={rollup} index={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RollupsTable;
