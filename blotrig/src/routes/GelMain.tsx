import React, { useState } from "react";
import Papa, { type ParseResult } from "papaparse";

// subcomponents
import { GelSidebar } from "../components/GelSidebar";
import { CsvViewer } from "../components/CsvViewer";
import { ConfigsView } from "../components/ConfigsView";
import { type Tab, TabNav } from "../components/TabNav";
import { ErrorPopup } from "../components/ErrorPopup";

export function GelMain() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColNames, setCsvColNames] = useState<string[]>([]);
  const [selectedCol, setSelectedCol] = useState<string>("None");
  const [lanes, setLanes] = useState<number | "">("");
  const [replications, setReplications] = useState<number | "">("");
  const [activeTab, setActiveTab] = useState<Tab>("csv");
  const [error, setError] = useState<string | null>(null);

  // csv handler
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<string[]>(file, {
        complete: (results: ParseResult<string[]>) => {
          setCsvData(results.data);
          if (results.data.length > 0) {
            setCsvColNames(results.data[0]);
          } else {
            setCsvColNames([]);
            setSelectedCol("None");
          }
        },
        skipEmptyLines: true,
      });
    }
  };

  // number input validation
  const handleNumberChange =
    (
      setter: React.Dispatch<React.SetStateAction<number | "">>,
      label: string,
    ) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const numValue = value === "" ? "" : Number(value);

      if (numValue === "" || (Number.isInteger(numValue) && numValue >= 0)) {
        if (numValue !== "" && numValue > 50) {
          setter("");
          setError(`❌ Invalid input: ${label} must be ≤ 50`);
          return;
        }
        setter(numValue);
      }
    };

  return (
    <div className="relative min-h-screen flex bg-gray-50">
      <GelSidebar
        csvColNames={csvColNames}
        selectedCol={selectedCol}
        setSelectedCol={setSelectedCol}
        lanes={lanes}
        setLanes={setLanes}
        replications={replications}
        setReplications={setReplications}
        onFileChange={handleFileChange}
        onNumberChange={handleNumberChange}
      />

      {/* content area */}
      <div className="w-full md:w-3/5 bg-white border-l border-gray-300 p-6 flex flex-col">
        <TabNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          lanes={lanes}
        />

        {activeTab === "csv" && <CsvViewer csvData={csvData} />}
        {activeTab === "configs" && (
          <ConfigsView
            lanes={lanes}
            replications={replications}
            selectedCol={selectedCol}
          />
        )}
      </div>

      {/* error popup */}
      {error && <ErrorPopup error={error} onClose={() => setError(null)} />}
    </div>
  );
}
