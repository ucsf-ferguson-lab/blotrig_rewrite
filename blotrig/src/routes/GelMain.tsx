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

export function GelMain() {
  //csv state
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColNames, setCsvColNames] = useState<string[]>([]);
  const [groupsCol, setGroupsCol] = useState<string>("None");
  const [subjectsCol, setSubjectsCol] = useState<string>("None");

  //app state
  const [activeTab, setActiveTab] = useState<Tab>("csv");
  const [error, setError] = useState<string | null>(null);

  //subjects table
  const [subjectsTable, setSubjectsTable] = useState<SubjectsTable>({});
  const canDownloadSubjects = Object.keys(subjectsTable).length > 0;

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
        }
      });
    },
    [],
  );

  const handleCreateSubjects = useCallback(() => {
    if (!csvData.length || groupsCol === "None" || subjectsCol === "None") {
      setError("Please select valid group and subject columns.");
      return;
    }
    try {
      const table = buildSubjectsTable(csvData, groupsCol, subjectsCol);
      setSubjectsTable(table);
      setActiveTab("subjects");
    } catch (e) {
      console.error(e);
      setError("Failed to create subjects table.");
    }
  }, [csvData, groupsCol, subjectsCol]);

  const handleDownloadSubjects = useCallback(() => {
    if (!canDownloadSubjects) {
      setError("No subjects table to download.");
      return;
    }
    const csvString = subjectsTableToCsv(subjectsTable);
    downloadCsv(csvString, "subjects_table.csv");
  }, [subjectsTable, canDownloadSubjects]);

  const isCreateSubjectsDisabled =
    csvData.length === 0 || groupsCol === "None" || subjectsCol === "None";

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
      />

      {/* content area */}
      <div className="w-full md:w-3/5 bg-white border-l border-gray-300 p-6 flex flex-col">
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "csv" && <CsvViewer csvData={csvData} />}

        {activeTab === "subjects" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Subjects Table</h2>
            <ConvertJsonToTable data={subjectsTable} />
          </div>
        )}
      </div>

      {/* error popup */}
      {error && <ErrorPopup error={error} onClose={() => setError(null)} />}
    </div>
  );
}
