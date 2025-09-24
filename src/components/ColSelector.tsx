import React from "react";

interface ColSelectorProps {
  csvColNames: string[];
  selectedCol: string;
  setSelectedCol: React.Dispatch<React.SetStateAction<string>>;
}

export function ColSelector({
  csvColNames,
  selectedCol,
  setSelectedCol,
}: ColSelectorProps) {
  return (
    <select
      value={selectedCol}
      onChange={(e) => setSelectedCol(e.target.value)}
      disabled={csvColNames.length === 0}
      className={`rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none ${
        csvColNames.length === 0
          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
          : ""
      }`}
    >
      <option value="None" disabled={csvColNames.length > 0}>
        None
      </option>
      {csvColNames.map((colName, i) => (
        <option key={i} value={colName}>
          {colName}
        </option>
      ))}
    </select>
  );
}
