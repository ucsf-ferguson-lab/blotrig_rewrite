import React, { useState } from "react";
import Papa, { type ParseResult } from "papaparse";

import { GelSidebar } from "../components/GelSidebar";
import { CsvViewer } from "../components/CsvViewer";
import { type Tab, TabNav } from "../components/TabNav";
import { ErrorPopup } from "../components/ErrorPopup";

import type { SubjectsTable } from "../logic/models";
import { createSubjectsTable } from "../logic/gel_logic";
import { ConvertJsonToTable } from "../components/ViewTable";

export function GelMain() {
  //csv hooks
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [csvColNames, setCsvColNames] = useState<string[]>([]);
  const [groupsCol, setGroupsCol] = useState<string>("None");
  const [subjectsCol, setSubjectsCol] = useState<string>("None");

  // app hooks
  const [activeTab, setActiveTab] = useState<Tab>("csv");
  const [error, setError] = useState<string | null>(null);

  // subjects table
  const [subjectsTable, setSubjectsTable] = useState<SubjectsTable>({});
  const canDownloadSubjects = Object.keys(subjectsTable).length > 0;

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
            setGroupsCol("None");
            setSubjectsCol("None");
          }
        },
        skipEmptyLines: true,
      });
    }
  };

  // subjects table creation handler
  const handleCreateSubjects = () => {
    if (!csvData.length || groupsCol === "None" || subjectsCol === "None") {
      setError("Please select valid group and subject columns.");
      return;
    }

    const headers = csvData[0];
    const rows = csvData
      .slice(1)
      .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));

    try {
      const table: SubjectsTable = createSubjectsTable(
        rows,
        groupsCol,
        subjectsCol,
      );
      setSubjectsTable(table);
      setActiveTab("subjects");
    } catch (e) {
      setError("Failed to create subjects table.");
      console.error(e);
    }
  };

  // download subjects table as csv handler
  const handleDownloadSubjects = () => {
    if (!subjectsTable || Object.keys(subjectsTable).length === 0) {
      setError("No subjects table to download.");
      return;
    }

    const columns = Object.keys(subjectsTable);
    const colArrays = Object.values(subjectsTable);
    const maxLen = Math.max(...colArrays.map((arr) => arr.length));

    const rows = [];
    for (let i = 0; i < maxLen; i++) {
      const row: Record<string, string> = {};
      columns.forEach((col) => {
        row[col] = subjectsTable[col][i] ?? "";
      });
      rows.push(row);
    }

    const csvString = Papa.unparse(rows);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subjects_table.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // disable create subjects button if values missing
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

        {activeTab === "csv" && (
          <div>
            <CsvViewer csvData={csvData} />
          </div>
        )}

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
