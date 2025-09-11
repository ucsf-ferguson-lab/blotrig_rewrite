import React from "react";
import { useNavigate } from "react-router-dom";

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
  onDownloadSubjects,
  canDownloadSubjects,
  onCheckDuplicates,
  subjectsTable,
}: GelSidebarProps) {
  const navigate = useNavigate();

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
      </ol>

      <div className="mt-6 flex space-x-2">
        <button
          type="button"
          onClick={onDownloadSubjects}
          disabled={!canDownloadSubjects}
          className={`px-3 py-2 border rounded text-white ${
            canDownloadSubjects
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-300 cursor-not-allowed"
          }`}
        >
          Download Subjects Table
        </button>

        <button
          type="button"
          onClick={() => {
            setGroupsCol("None");
            setSubjectsCol("None");
          }}
          className="px-3 py-2 border rounded bg-gray-100 hover:bg-gray-200"
        >
          Clear All
        </button>
      </div>

      <div>
        <button
          type="button"
          onClick={() => navigate("/create", { state: { subjectsTable } })}
          disabled={!canDownloadSubjects}
          className={`px-3 py-2 border rounded text-white ${
            canDownloadSubjects
              ? "bg-purple-600 hover:bg-purple-700"
              : "bg-purple-300 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
