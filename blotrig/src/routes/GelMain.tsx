import React, { useState, useCallback } from "react";

import { GelSidebar } from "../components/GelSidebar";
import { CsvViewer } from "../components/CsvViewer";
import { type Tab, TabNav } from "../components/TabNav";
import { ErrorPopup } from "../components/ErrorPopup";
import { ConvertJsonToTable } from "../components/ViewTable";

import type { SubjectsTable } from "../logic/models";
import { parseCsvFile, downloadCsv } from "../logic/gel_main/csv_utils";
import {
  buildSubjectsTable,
  subjectsTableToCsv,
} from "../logic/gel_main/subjects_utils";
import { createGelWrapper } from "../logic/gel_create/split";

export function GelMain() {
  //csv state
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColNames, setCsvColNames] = useState<string[]>([]);
  const [groupsCol, setGroupsCol] = useState<string>("None");
  const [subjectsCol, setSubjectsCol] = useState<string>("None");
  const [hasDuplicates, setHasDuplicates] = useState(false);

  //app state
  const [activeTab, setActiveTab] = useState<Tab>("csv");
  const [error, setError] = useState<string | null>(null);

  //subjects table + gels
  const [subjectsTable, setSubjectsTable] = useState<SubjectsTable>({});
  const [gels, setGels] = useState<(string | number)[][]>([]);
  const canDownloadSubjects = Object.keys(subjectsTable).length > 0;

  //user input for lane count
  const [numLanes, setNumLanes] = useState<number>(10);

  //file upload handler
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      parseCsvFile(file, (data, headers) => {
        setCsvData(data);
        setCsvColNames(headers);
        if (!headers.length) {
          setGroupsCol("None");
          setSubjectsCol("None");
          setHasDuplicates(false);
        }
      });
    },
    [],
  );

  //create subjects table handler
  const handleCreateSubjects = useCallback(() => {
    if (!csvData.length || groupsCol === "None" || subjectsCol === "None") {
      setError("Please select valid group and subject columns.");
      return;
    }
    try {
      const table = buildSubjectsTable(csvData, groupsCol, subjectsCol);
      setSubjectsTable(table);
      setGels([]); // reset gels when subjects change
      setActiveTab("subjects"); //auto-switch
    } catch (e) {
      console.error(e);
      setError("Failed to create subjects table.");
    }
  }, [csvData, groupsCol, subjectsCol]);

  //download subjects table handler
  const handleDownloadSubjects = useCallback(() => {
    if (!canDownloadSubjects) {
      setError("No subjects table to download.");
      return;
    }
    const csvString = subjectsTableToCsv(subjectsTable);
    downloadCsv(csvString, "subjects_table.csv");
  }, [subjectsTable, canDownloadSubjects]);

  //check duplicates
  const handleCheckDuplicates = useCallback(() => {
    if (!canDownloadSubjects) {
      setError("No subjects table available.");
      setHasDuplicates(false);
      return;
    }

    const allIds: string[] = [];
    const duplicates: string[] = [];

    for (const group in subjectsTable) {
      for (const id of subjectsTable[group]) {
        if (allIds.includes(id)) {
          duplicates.push(id);
        } else {
          allIds.push(id);
        }
      }
    }

    if (duplicates.length > 0) {
      setError(
        `Duplicate subject IDs found: ${[...new Set(duplicates)].join(", ")}`,
      );
      setHasDuplicates(true);
    } else {
      setError("No duplicate subject IDs found.");
      setHasDuplicates(false);
    }
  }, [subjectsTable, canDownloadSubjects]);

  //create gels handler
  const handleCreateGel = useCallback(() => {
    if (!canDownloadSubjects || hasDuplicates) {
      setError(
        "Cannot create gels. Ensure subjects table is valid and has no duplicates.",
      );
      return;
    }

    const numGroups = Object.keys(subjectsTable).length;
    if (numLanes < numGroups) {
      setError(
        `Number of lanes (${numLanes}) cannot be less than number of groups (${numGroups}).`,
      );
      return;
    }

    if (numLanes < 2) {
      setError("Number of lanes must be at least 2.");
      return;
    }

    try {
      const allSubjects: string[][] = Object.values(subjectsTable);
      const newGels = createGelWrapper(allSubjects, numLanes - 1);
      setGels(newGels);
      setActiveTab("gels");
    } catch (e) {
      console.error(e);
      setError("Failed to create gels.");
    }
  }, [subjectsTable, canDownloadSubjects, hasDuplicates, numLanes]);

  //download gels CSV
  function handleDownloadGelsCSV() {
    if (!gels.length) {
      setError("No gels generated.");
      return;
    }
    const csvContent: string = gels
      .map((gel) => gel.map((lane) => `"${lane}"`).join(","))
      .join("\n");

    const blob: Blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const downloadUrl: string = URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "gel_data.csv");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }

  const isCreateSubjectsDisabled =
    csvData.length === 0 || groupsCol === "None" || subjectsCol === "None";

  const numGroups = Object.keys(subjectsTable).length;
  const isCreateGelDisabled =
    !canDownloadSubjects || hasDuplicates || numLanes < numGroups;

  return (
    <div className="relative min-h-screen flex bg-gray-50">
      <GelSidebar
        csvColNames={csvColNames}
        groupsCol={groupsCol}
        setGroupsCol={setGroupsCol}
        subjectsCol={subjectsCol}
        setSubjectsCol={setSubjectsCol}
        onFileChange={handleFileChange}
        onCreateSubjects={handleCreateSubjects}
        createSubjectsDisabled={isCreateSubjectsDisabled}
        onDownloadSubjects={handleDownloadSubjects}
        canDownloadSubjects={canDownloadSubjects}
        onCheckDuplicates={handleCheckDuplicates}
        subjectsTable={subjectsTable}
        hasDuplicates={hasDuplicates}
        onCreateGel={handleCreateGel}
        numLanes={numLanes}
        setNumLanes={setNumLanes}
        isCreateGelDisabled={isCreateGelDisabled}
      />

      {/* content area */}
      <div className="w-full md:w-3/5 bg-white border-l border-gray-300 p-6 flex flex-col">
        <TabNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canShowGels={canDownloadSubjects && !hasDuplicates}
        />

        {activeTab === "csv" && <CsvViewer csvData={csvData} />}

        {activeTab === "subjects" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Subjects Table</h2>

            <button
              type="button"
              onClick={handleDownloadSubjects}
              disabled={!canDownloadSubjects}
              className={`mt-4 mb-6 px-3 py-2 border rounded text-white ${
                canDownloadSubjects
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Download Subjects Table
            </button>

            <ConvertJsonToTable data={subjectsTable} />
          </div>
        )}

        {activeTab === "gels" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Generated Gels</h2>
            <button
              type="button"
              onClick={handleDownloadGelsCSV}
              className="mb-6 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-700"
            >
              Download gels as CSV
            </button>

            <div className="space-y-6">
              {gels.map((gel, gelIndex) => (
                <div key={gelIndex} className="border p-4 rounded-md shadow">
                  <h3 className="font-semibold mb-2">Gel {gelIndex + 1}</h3>
                  <div className="grid grid-cols-10 gap-2">
                    {gel.map((lane, laneIndex) => (
                      <div
                        key={laneIndex}
                        className="border px-2 py-1 text-center bg-gray-50"
                      >
                        {lane}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <ErrorPopup error={error} onClose={() => setError(null)} />}
    </div>
  );
}
