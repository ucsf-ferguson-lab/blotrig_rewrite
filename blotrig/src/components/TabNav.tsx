import React from "react";

export type Tab = "csv" | "configs";

interface TabNavProps {
  activeTab: Tab;
  setActiveTab: React.Dispatch<React.SetStateAction<Tab>>;
  lanes: number | "";
}

export function TabNav({ activeTab, setActiveTab, lanes }: TabNavProps) {
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
        CSV Viewer
      </button>
      <button
        className={`pb-2 font-semibold ${
          activeTab === "configs"
            ? "border-b-2 border-blue-500 text-blue-600"
            : "text-gray-500"
        }`}
        onClick={() => setActiveTab("configs")}
        type="button"
        disabled={lanes === "" || lanes <= 0}
        title={
          lanes === "" || lanes <= 0 ? "Enter lanes first" : "View Configs"
        }
      >
        Configs
      </button>
    </div>
  );
}
