import React, { useState } from "react";
import { format } from "date-fns";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { NamespaceMessage } from "../../types/namespace";
import { formatSize } from "@/app/utils/formatters";

interface MessageRowProps {
  message: NamespaceMessage;
  index: number;
}

const MessageRow: React.FC<MessageRowProps> = ({ message, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  // Calculate total blob size if data is available
  const totalBlobSize = message.data?.BlobSizes
    ? message.data.BlobSizes.reduce((total, size) => total + size, 0)
    : null;

  // Get transaction status if available
  const txStatus = message.tx?.status || null;

  // Format transaction time
  const formattedTime = format(new Date(message.time), "PPp");
  // Get explorer URL
  const txUrl = message.tx?.hash
    ? `https://celenium.io/tx/${message.tx.hash}?tab=messages`
    : null;

  return (
    <>
      <tr
        key={`row-${index}`}
        className="border-t cursor-pointer hover:bg-gray-50"
        onClick={toggleExpand}
      >
        <td className="px-4 py-2 flex items-center">
          {isExpanded ? (
            <ChevronDown className="mr-2 w-4 h-4" />
          ) : (
            <ChevronRight className="mr-2 w-4 h-4" />
          )}
          {formattedTime}
        </td>
        <td className="px-4 py-2">{message.height}</td>
        <td className="px-4 py-2">{message.type}</td>
        <td className="px-4 py-2 flex items-center">
          {formatSize(
            (message?.data?.BlobSizes ?? []).reduce(
              (acc, curr) => acc + curr,
              0
            )
          )}
          {txStatus && (
            <span className="ml-2">
              {txStatus === "success" ? (
                <CheckCircle size={16} className="text-green-500" />
              ) : (
                <XCircle size={16} className="text-red-500" />
              )}
            </span>
          )}
        </td>
      </tr>

      {isExpanded && (
        <tr key={`expanded-${index}`} className="bg-gray-50">
          <td colSpan={4} className="px-4 py-2">
            <div className="p-2">
              <h4 className="font-medium mb-4">Transaction Details</h4>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Transaction Hash
                  </p>
                  <p className="text-xs break-all">
                    {message.tx?.hash || "N/A"}
                    {txUrl && (
                      <a
                        href={txUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center text-blue-500 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} className="inline" />
                      </a>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Status</p>
                  <p className="flex items-center">
                    {txStatus ? (
                      <>
                        <span
                          className={`${
                            txStatus === "success"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {txStatus.charAt(0).toUpperCase() + txStatus.slice(1)}
                        </span>
                        {txStatus === "success" ? (
                          <CheckCircle
                            size={14}
                            className="ml-1 text-green-500"
                          />
                        ) : (
                          <XCircle size={14} className="ml-1 text-red-500" />
                        )}
                      </>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Position</p>
                  <p>{message?.tx?.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Gas Used</p>
                  <p>
                    {message.tx?.gas_used && message.tx?.gas_wanted ? (
                      <>
                        <span className="block text-base font-semibold">
                          {(
                            (message.tx.gas_used / message.tx.gas_wanted) *
                            100
                          ).toFixed(2)}
                          %
                        </span>
                        <span className="block text-sm text-gray-600">
                          {message.tx.gas_used.toLocaleString()} /{" "}
                          {message.tx.gas_wanted.toLocaleString()}
                        </span>
                      </>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Fee</p>
                  <p>{message.tx?.fee ? `${message.tx.fee} utia` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Message ID
                  </p>
                  <p>{message.id ? message.id.toLocaleString() : "N/A"}</p>
                </div>
              </div>

              {/* Blob Data */}
              {message.data?.BlobSizes && message.data.BlobSizes.length > 0 && (
                <div>
                  <h5 className="text-sm font-medium mb-2">
                    Blob Data ({message.data.BlobSizes.length} blobs,{" "}
                    {formatSize(totalBlobSize || 0)} total)
                  </h5>
                  <div className="bg-gray-100 p-3 rounded overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-2 py-1 text-left font-medium">#</th>
                          <th className="px-2 py-1 text-left font-medium">
                            Size
                          </th>
                          <th className="px-2 py-1 text-left font-medium">
                            Share Commitments
                          </th>
                          <th className="px-2 py-1 text-left font-medium">
                            Share Version
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {message.data.BlobSizes.map((size, i) => (
                          <tr
                            key={i}
                            className="border-b border-gray-200 last:border-0"
                          >
                            <td className="px-2 py-1">{i + 1}</td>
                            <td className="px-2 py-1">{formatSize(size)}</td>
                            <td className="px-2 py-1 break-all text-xs">
                              {message.data?.ShareCommitments?.[i] || "N/A"}
                            </td>
                            <td className="px-2 py-1">
                              {message.data?.ShareVersions?.[i] !== undefined
                                ? message.data.ShareVersions[i]
                                : "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Signer */}
              {message.data?.Signer && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 font-medium">Signer</p>
                  <p className="text-xs break-all">{message.data.Signer}</p>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default MessageRow;
