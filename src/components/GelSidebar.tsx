import React, { useEffect } from "react";
import { ColSelector } from "./ColSelector";
import type { SubjectsTable } from "../logic/models";

interface GelSidebarProps {
  csvColNames: string[];
  groupsCol: string;
  setGroupsCol: React.Dispatch<React.SetStateAction<string>>;
  subjectsCol: string;
  setSubjectsCol: React.Dispatch<React.SetStateAction<string>>;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCreateSubjects: () => void;
  createSubjectsDisabled: boolean;
  onDownloadSubjects: () => void;
  canDownloadSubjects: boolean;
  onCheckDuplicates: () => void;
  subjectsTable: SubjectsTable;
  hasDuplicates: boolean;
  onCreateGel: () => void;
  numLanes: number;
  setNumLanes: React.Dispatch<React.SetStateAction<number>>;
  isCreateGelDisabled: boolean;
  numReplications: number;
  setNumReplications: React.Dispatch<React.SetStateAction<number>>;
}

export function GelSidebar({
  csvColNames,
  groupsCol,
  setGroupsCol,
  subjectsCol,
  setSubjectsCol,
  onFileChange,
  onCreateSubjects,
  createSubjectsDisabled,
  canDownloadSubjects,
  onCheckDuplicates,
  onCreateGel,
  numLanes,
  setNumLanes,
  isCreateGelDisabled,
  subjectsTable,
  numReplications,
  setNumReplications,
}: GelSidebarProps) {
  //calculate num groups (for minLanes & gel generate)
  const numGroups = Object.keys(subjectsTable).length;
  const minLanes = numGroups > 0 ? numGroups + 1 : 2;

  //reset default when subjects change
  useEffect(() => {
    if (numGroups > 0 && numLanes < minLanes) {
      setNumLanes(minLanes);
    }
  }, [numGroups, minLanes, numLanes, setNumLanes]);

  return (
    <div className="w-full md:w-2/5 p-6 border-r border-gray-300 bg-white">
      <h2 className="text-lg font-semibold mb-5">Setup:</h2>

      <ol className="list-decimal list-inside space-y-6 text-sm">
        {/* upload CSV */}
        <li>
          Upload your samples as a CSV file
          <br />
          <input
            type="file"
            accept=".csv"
            onChange={onFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-md"
          />
        </li>

        {/* select group col */}
        <li>
          Select group column
          <br />
          <ColSelector
            csvColNames={csvColNames}
            selectedCol={groupsCol}
            setSelectedCol={setGroupsCol}
          />
        </li>

        {/* select subjects col */}
        <li>
          Select subjects column
          <br />
          <ColSelector
            csvColNames={csvColNames}
            selectedCol={subjectsCol}
            setSelectedCol={setSubjectsCol}
          />
        </li>

        {/* create subjects table */}
        <li>
          <button
            type="button"
            onClick={onCreateSubjects}
            disabled={createSubjectsDisabled}
            className={`px-3 py-2 border rounded text-white ${
              createSubjectsDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Create Subjects Table
          </button>
        </li>

        {/* check id dupes */}
        <li>
          <button
            type="button"
            onClick={onCheckDuplicates}
            disabled={!canDownloadSubjects}
            className={`px-3 py-2 border rounded text-white ${
              canDownloadSubjects
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-yellow-300 cursor-not-allowed"
            }`}
          >
            Check for duplicate IDs
          </button>
        </li>

        {/* create gels with adjustable lanes */}
        <li>
          <label htmlFor="numLanes">Enter number of lanes:</label>

          <div className="flex items-center space-x-2 mb-2 mt-3 mx-3">
            <input
              id="numLanes"
              type="number"
              min={minLanes}
              value={numLanes}
              onChange={(e) =>
                setNumLanes(
                  Math.max(parseInt(e.target.value, 10) || minLanes, minLanes),
                )
              }
              className="w-20 border px-2 py-1 rounded"
            />

            <span className="text-xs text-gray-500">
              (Min = Groups + 1, includes ladder)
            </span>
          </div>
        </li>

        <li>
          <button
            type="button"
            onClick={onCreateGel}
            disabled={isCreateGelDisabled}
            className={`px-3 py-2 border rounded text-white ${
              isCreateGelDisabled
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Create Gel
          </button>
        </li>

        {/* technical replications */}
        <li>
          <label htmlFor="numReplications">
            Enter number of technical replications:
          </label>

          <div className="flex items-center space-x-2 mb-2 mt-3 mx-3">
            <input
              id="numReplications"
              type="number"
              min={1}
              value={numReplications}
              onChange={(e) =>
                setNumReplications(
                  Math.max(parseInt(e.target.value, 10) || 1, 1),
                )
              }
              className="w-20 border px-2 py-1 rounded"
            />

            <span className="text-xs text-gray-500">(Min = 1)</span>
          </div>
        </li>
      </ol>

      <div className="mt-6 flex space-x-2">
        <button
          type="button"
          onClick={() => {
            setGroupsCol("None");
            setSubjectsCol("None");
            setNumLanes(minLanes);
            setNumReplications(1);
          }}
          className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Clear all options
        </button>
      </div>
    </div>
  );
}
