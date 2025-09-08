import React from "react";
import { ColSelector } from "./ColSelector";

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
}: GelSidebarProps) {
  return (
    <div className="w-full md:w-2/5 p-6 border-r border-gray-300 bg-white">
      <h2 className="text-lg font-semibold mb-5">Setup:</h2>

      <ol className="list-decimal list-inside space-y-6 text-sm">
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

        <li>
          Select group column
          <br />
          <ColSelector
            csvColNames={csvColNames}
            selectedCol={groupsCol}
            setSelectedCol={setGroupsCol}
          />
        </li>

        <li>
          Select subjects column
          <br />
          <ColSelector
            csvColNames={csvColNames}
            selectedCol={subjectsCol}
            setSelectedCol={setSubjectsCol}
          />
        </li>
      </ol>

      <div className="mt-6 flex space-x-2">
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
          Download Subjects CSV
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
    </div>
  );
}
