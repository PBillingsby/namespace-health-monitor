import React, { useState, useEffect } from "react";
import { NamespaceMessage } from "../../types/namespace";
import MessageRow from "./MessageRow";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

interface MessagesTableProps {
  messages: NamespaceMessage[];
  totalMessages: number;
  pageSize?: number;
  onPageChange: (offset: number, limit: number) => Promise<void>;
  isLoading: boolean;
}

const MessagesTable: React.FC<MessagesTableProps> = ({
  messages,
  totalMessages,
  pageSize = 10,
  onPageChange,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= Math.ceil(totalMessages / pageSize)) {
      const offset = (page - 1) * pageSize;
      await onPageChange(offset, pageSize);
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [totalMessages]);

  if (messages.length === 0 && !isLoading) return null;

  const totalPages = Math.max(1, Math.ceil(totalMessages / pageSize));

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(startIndex + pageSize - 1, totalMessages);

  const pageNumbers = [];
  const maxPageButtons = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Blockchain Messages</h2>
        <div className="text-sm text-gray-500">
          {isLoading ? (
            <span className="flex items-center">
              <Loader size={16} className="animate-spin mr-2" />
              Loading messages...
            </span>
          ) : (
            <span>
              Showing {startIndex}-{endIndex} of {totalMessages} messages
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Time</th>
              <th className="px-4 py-2 text-left">Height</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Size / Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && messages.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  <Loader size={24} className="animate-spin mx-auto mb-2" />
                  Loading messages...
                </td>
              </tr>
            ) : (
              messages.map((message, index) => (
                <MessageRow key={message.id} message={message} index={index} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className={`p-2 rounded ${
              currentPage === 1 || isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500 hover:bg-blue-50"
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                disabled={isLoading}
                className={`px-3 py-1 rounded ${
                  currentPage === 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="px-2 py-1 text-gray-500">...</span>
              )}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              disabled={isLoading}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-50"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="px-2 py-1 text-gray-500">...</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                disabled={isLoading}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages
                    ? "bg-blue-500 text-white"
                    : "hover:bg-blue-50"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className={`p-2 rounded ${
              currentPage === totalPages || isLoading
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-500 hover:bg-blue-50"
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MessagesTable;
