import React, { useState } from "react";
import Papa, { type ParseResult } from "papaparse";

type Tab = "csv" | "configs";

export function GelCreatorPage() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColNames, setCsvColNames] = useState<string[]>([]);
  const [selectedCol, setSelectedCol] = useState<string>("None");
  const [lanes, setLanes] = useState<number | "">("");
  const [replications, setReplications] = useState<number | "">("");
  const [activeTab, setActiveTab] = useState<Tab>("csv");
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<string[]>(file, {
        complete: (results: ParseResult<string[]>) => {
          setCsvData(results.data);
          if (results.data.length > 0) {
            setCsvColNames(results.data[0]); //set as None until user selects col
          } else {
            setCsvColNames([]);
            setSelectedCol("None");
          }
        },
        skipEmptyLines: true,
      });
    }
  };

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
      {/* sidebar */}
      <div className="w-full md:w-2/5 p-6 border-r border-gray-300 bg-white">
        <h2 className="text-lg font-semibold mb-5">Setup:</h2>
        <ol className="list-decimal list-inside space-y-6 text-sm">
          <li className="flex flex-col gap-2">
            <p>Upload your samples as a tidy CSV file</p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0 
                         file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 
                         hover:file:bg-blue-100"
            />
          </li>

          <li className="flex flex-col gap-2">
            <p>Select a column name from CSV</p>
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
          </li>

          <li className="flex flex-col gap-2">
            <p>Enter number of lanes per gel (including ladder)</p>
            <input
              type="number"
              min={0}
              max={50}
              step={1}
              value={lanes}
              onChange={handleNumberChange(setLanes, "Number of Lanes")}
              placeholder="Enter number"
              className="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </li>
          <li className="flex flex-col gap-2">
            <p>Enter number of technical replications</p>
            <input
              type="number"
              min={0}
              max={50}
              step={1}
              value={replications}
              onChange={handleNumberChange(
                setReplications,
                "Number of Replications",
              )}
              placeholder="Enter number"
              className="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </li>
        </ol>

        <button
          type="button"
          onClick={() => {
            setSelectedCol("None");
            setLanes("");
            setReplications("");
          }}
          className="px-3 py-1 rounded border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
          title="Clear all"
        >
          Clear all
        </button>
      </div>

      {/* content viewer */}
      <div className="w-full md:w-3/5 bg-white border-l border-gray-300 p-6 overflow-auto shadow-lg flex flex-col">
        {/* tab buttons */}
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

        {/* tab content */}
        {activeTab === "csv" && (
          <div className="grow overflow-auto">
            {csvData.length > 0 ? (
              <div className="overflow-x-auto overflow-y-auto rounded-lg shadow-lg h-full border border-gray-200">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
                    <tr>
                      {csvData[0].map((header, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider border-b border-gray-200"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {csvData.slice(1).map((row, i) => (
                      <tr
                        key={i}
                        className={`transition-colors duration-200 ${
                          i % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50`}
                      >
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-6 py-3 text-sm text-gray-700 whitespace-pre-wrap border-b border-gray-100"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">No CSV uploaded yet.</p>
            )}
          </div>
        )}

        {activeTab === "configs" && (
          <div className="grow overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Gel Configurations</h3>
            <p className="text-gray-700">
              Number of lanes per gel:{" "}
              <span className="font-mono">{lanes}</span>
            </p>
            <p className="text-gray-700">
              Replications:{" "}
              <span className="font-mono">{replications || "Not set"}</span>
            </p>
            <p className="text-gray-700">
              Selected CSV column:{" "}
              <span className="font-mono">{selectedCol}</span>
            </p>
          </div>
        )}
      </div>

      {/* error popup */}
      {error && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm text-center">
            <h2 className="text-lg font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
