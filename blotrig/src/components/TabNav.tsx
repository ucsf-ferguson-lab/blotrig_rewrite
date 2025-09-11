import React from "react";

export type Tab = "csv" | "subjects" | "gels";

interface TabNavProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  canShowGels: boolean;
}

export function TabNav({ activeTab, setActiveTab, canShowGels }: TabNavProps) {
  return (
    <div className="mb-4 flex space-x-4 border-b border-gray-200">
      <button
        className={`pb-2 font-semibold ${
          activeTab === "csv"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("csv")}
        type="button"
      >
        CSV viewer
      </button>

      <button
        className={`pb-2 font-semibold ${
          activeTab === "subjects"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("subjects")}
        type="button"
      >
        Subjects table
      </button>

      <button
        disabled={!canShowGels}
        className={`pb-2 font-semibold ${
          activeTab === "gels"
            ? "border-b-2 border-blue-500 text-blue-600"
            : !canShowGels
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500"
        }`}
        onClick={() => canShowGels && setActiveTab("gels")}
        type="button"
      >
        Gels
      </button>
    </div>
  );
}
