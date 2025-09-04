import React, { useState } from "react";
import Papa, { type ParseResult } from "papaparse";

export function GelCreatorPage() {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [lanes, setLanes] = useState<number | "">("");
  const [replications, setReplications] = useState<number | "">("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse<string[]>(file, {
        complete: (results: ParseResult<string[]>) => {
          setCsvData(results.data);
        },
        skipEmptyLines: true,
      });
    }
  };

  const handleNumberChange =
    (setter: React.Dispatch<React.SetStateAction<number | "">>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      const numValue = value === "" ? "" : Number(value);
      if (numValue === "" || (Number.isInteger(numValue) && numValue >= 0)) {
        setter(numValue);
      }
    };

  return (
    <div className="relative min-h-screen flex bg-gray-50">
      {/* Sidebar / instructions */}
      <div className="w-full md:w-2/5 p-6 border-r border-gray-300 bg-white">
        <h2 className="text-lg font-semibold mb-5">Instructions:</h2>
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
            <p>Enter number of lanes per gel (including ladder)</p>
            <input
              type="number"
              min={0}
              max={50}
              step={1}
              value={lanes}
              onChange={handleNumberChange(setLanes)}
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
              onChange={handleNumberChange(setReplications)}
              placeholder="Enter number"
              className="rounded border border-gray-300 px-3 py-1 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </li>
        </ol>
      </div>

      {/* CSV contents */}
      <div className="w-full md:w-3/5 bg-white border-l border-gray-300 p-6 overflow-auto shadow-lg">
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
    </div>
  );
}
