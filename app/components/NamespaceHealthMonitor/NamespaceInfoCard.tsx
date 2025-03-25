import React from "react";
import { NamespaceInfo } from "../../types/namespace";
import { formatDate, formatSize } from "../../utils/formatters";

interface NamespaceInfoCardProps {
  info: NamespaceInfo;
}

const NamespaceInfoCard: React.FC<NamespaceInfoCardProps> = ({ info }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Namespace Information</h2>
      <div className="md:flex-row flex flex-col gap-8">
        <div>
          <p className="truncate">
            <span className="font-semibold">ID:</span> {info.namespace_id}
          </p>
          <p>
            <span className="font-semibold">Name:</span> {info.name}
          </p>
          <p>
            <span className="font-semibold">Version:</span> {info.version}
          </p>
          <p>
            <span className="font-semibold">Size:</span> {formatSize(info.size)}
          </p>
        </div>
        <div>
          <p>
            <span className="font-semibold">Blobs Count:</span>{" "}
            {info.blobs_count.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">PFB Count:</span>{" "}
            {info.pfb_count.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Last Height:</span>{" "}
            {info.last_height.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Last Update:</span>{" "}
            {formatDate(info.last_message_time)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NamespaceInfoCard;
