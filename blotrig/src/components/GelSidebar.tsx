import React from "react";
import { NumberInput } from "./NumberInput";
import { ColSelector } from "./ColSelector";

interface GelSidebarProps {
  csvColNames: string[];
  selectedCol: string;
  setSelectedCol: React.Dispatch<React.SetStateAction<string>>;
  lanes: number | "";
  setLanes: React.Dispatch<React.SetStateAction<number | "">>;
  replications: number | "";
  setReplications: React.Dispatch<React.SetStateAction<number | "">>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNumberChange: (
    setter: React.Dispatch<React.SetStateAction<number | "">>,
    label: string,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function GelSidebar({
  csvColNames,
  selectedCol,
  setSelectedCol,
  lanes,
  setLanes,
  replications,
  setReplications,
  onFileChange,
  onNumberChange,
}: GelSidebarProps) {
  return (
    <div className="w-full md:w-2/5 p-6 border-r border-gray-300 bg-white">
      <h2 className="text-lg font-semibold mb-5">Setup:</h2>
      <ol className="list-decimal list-inside space-y-6 text-sm">
        <li>
          <p>Upload your samples as a tidy CSV file</p>
          <input
            type="file"
            accept=".csv"
            onChange={onFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md"
          />
        </li>

        <li>
          <p>Select a column name from CSV</p>
          <ColSelector
            csvColNames={csvColNames}
            selectedCol={selectedCol}
            setSelectedCol={setSelectedCol}
          />
        </li>

        <li>
          <p>Enter number of lanes per gel (including ladder)</p>
          <NumberInput
            value={lanes}
            setter={setLanes}
            label="Number of Lanes"
            onNumberChange={onNumberChange}
          />
        </li>

        <li>
          <p>Enter number of technical replications</p>
          <NumberInput
            value={replications}
            setter={setReplications}
            label="Number of Replications"
            onNumberChange={onNumberChange}
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
        className="px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
      >
        Clear all
      </button>
    </div>
  );
}
