import React, { useState } from "react";

// Function to pad a hexadecimal string to 56 characters
function padHexTo56Chars(hexString: string): string {
  // Remove "0x" prefix if it exists
  const cleanHex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;

  if (cleanHex.length === 56) {
    return cleanHex;
  }

  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error("Input is not a valid hexadecimal string");
  }

  if (cleanHex.length > 56) {
    return cleanHex.slice(cleanHex.length - 56);
  }

  return cleanHex.padStart(56, "0");
}

interface SearchFormProps {
  defaultValue: string;
  onSubmit: (namespaceId: string) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  defaultValue,
  onSubmit,
  isLoading,
}) => {
  const [searchInput, setSearchInput] = useState<string>(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formattedId = padHexTo56Chars(searchInput);
      setSearchInput(formattedId);
      setError(null);
      onSubmit(formattedId);
    } catch (err) {
      setError("Please enter a valid hexadecimal namespace ID");
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setError(null);
            }}
            placeholder="Enter namespace ID"
            className={`flex-1 p-2 border rounded text-white ${
              error ? "border-red-500" : ""
            }`}
          />
          <button
            type="submit"
            className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Check Health"}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <p className="text-xs text-gray-500">
          You can enter a full 56-character namespace ID or a shorter hex string
        </p>
      </div>
    </form>
  );
};

export default SearchForm;
