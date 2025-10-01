import React, { useState, useCallback, useEffect } from "react";

import { GelSidebar } from "../components/GelSidebar";
import { CsvViewer } from "../components/CsvViewer";
import { type Tab, TabNav } from "../components/TabNav";
import { ErrorPopup } from "../components/ErrorPopup";
import { ConvertJsonToTable } from "../components/ViewTable";

import type { GelTableRow, SubjectsTable } from "../logic/models";
import { parseCsvFile, downloadCsv } from "../logic/gel_main/csv_utils";
import {
  buildSubjectsTable,
  shuffleWithConstraints,
  subjectsTableToCsv,
} from "../logic/gel_main/subjects_utils";
import { createGelWrapper } from "../logic/gel_create/split";
import { GelTable } from "../components/GelTable";
import { buildGelTableRows } from "../logic/export";
import { downloadGelTableCSV } from "../logic/downloads/gel_table";
import { Pagination } from "../components/Pagination";

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
  const [success, setSuccess] = useState<string | null>(null);

  //subjects table + gels
  const [subjectsTable, setSubjectsTable] = useState<SubjectsTable>({});
  const [gels, setGels] = useState<(string | number)[][]>([]);
  const canDownloadSubjects = Object.keys(subjectsTable).length > 0;

  //user input for lane count (min=2), technical replications (min=1)
  const [numLanes, setNumLanes] = useState<number>(2);
  const [numReplications, setNumReplications] = useState<number>(1);

  //pagination (csv page)
  const [csvPage, setCsvPage] = useState(1);
  const csvRowsPerPage = 15;
  const csvTotalPages = Math.ceil(csvData.length / csvRowsPerPage);
  const csvPaginatedData = csvData.slice(
    (csvPage - 1) * csvRowsPerPage,
    csvPage * csvRowsPerPage,
  );

  //pagination (subjects table)
  const [subjectsPage, setSubjectsPage] = useState(1);
  const subjectsEntries = Object.entries(subjectsTable);
  const subjectsRowsPerPage = 15;
  const subjectsTotalPages = Math.ceil(
    subjectsEntries.length / subjectsRowsPerPage,
  );
  const subjectsPaginated = Object.fromEntries(
    subjectsEntries.slice(
      (subjectsPage - 1) * subjectsRowsPerPage,
      subjectsPage * subjectsRowsPerPage,
    ),
  );

  //pagination (show gels)
  const [gelsPage, setGelsPage] = useState(1);
  const gelsPerPage = 5;
  const gelsTotalPages = Math.ceil(gels.length / gelsPerPage);
  const paginatedGels = gels.slice(
    (gelsPage - 1) * gelsPerPage,
    gelsPage * gelsPerPage,
  );

  useEffect(() => {
    const groupsCount = Object.keys(subjectsTable).length;
    if (groupsCount > 0) {
      setNumLanes((prev) => {
        if (prev <= groupsCount) {
          return groupsCount + 1;
        }
        return prev;
      });
    }
  }, [subjectsTable]);

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

      //reorder headers with constraints
      const shuffledKeys = shuffleWithConstraints(Object.keys(table));
      const reordered: SubjectsTable = {};
      for (const key of shuffledKeys) {
        reordered[key] = table[key];
      }

      setSubjectsTable(reordered);
      setGels([]); //reset gels when subjects change
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
      setSuccess(null); // clear success
    } else {
      setSuccess("No duplicate subject IDs found.");
      setHasDuplicates(false);
      setError(null); // clear error
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
      const newGels = createGelWrapper(allSubjects, numLanes);
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

  function handleDownloadGelTableCSV() {
    downloadGelTableCSV(gelTableRows, setError);
  }

  const isCreateSubjectsDisabled =
    csvData.length === 0 || groupsCol === "None" || subjectsCol === "None";

  const numGroups = Object.keys(subjectsTable).length;
  const isCreateGelDisabled =
    !canDownloadSubjects || hasDuplicates || numLanes < numGroups;

  const canShowSamples = gels.length > 0;
  const gelTableRows: GelTableRow[] = canShowSamples
    ? buildGelTableRows(subjectsTable, gels, numReplications)
    : [];

  //pagination (export table)
  const [samplesPage, setSamplesPage] = useState(1);
  const samplesRowsPerPage = 15;
  const samplesTotalPages = Math.ceil(gelTableRows.length / samplesRowsPerPage);
  const paginatedRows = gelTableRows.slice(
    (samplesPage - 1) * samplesRowsPerPage,
    samplesPage * samplesRowsPerPage,
  );

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
        numReplications={numReplications}
        setNumReplications={setNumReplications}
      />

      <div className="w-full md:w-3/5 bg-white border-l border-gray-300 p-6 flex flex-col">
        <TabNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canShowGels={canDownloadSubjects && !hasDuplicates}
          canShowSamples={canShowSamples}
        />

        {activeTab === "csv" && (
          <div>
            <CsvViewer csvData={csvPaginatedData} />
            <Pagination
              currentPage={csvPage}
              totalPages={csvTotalPages}
              onPageChange={setCsvPage}
            />
          </div>
        )}

        {activeTab === "subjects" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Subjects Table</h2>
            <button
              type="button"
              onClick={handleDownloadSubjects}
              disabled={!canDownloadSubjects}
              className={`mb-6 px-3 py-2 border rounded text-white ${
                canDownloadSubjects
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Download Subjects Table as csv
            </button>
            <ConvertJsonToTable data={subjectsPaginated} />
            <Pagination
              currentPage={subjectsPage}
              totalPages={subjectsTotalPages}
              onPageChange={setSubjectsPage}
            />
          </div>
        )}

        {activeTab === "gels" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Generated Gels</h2>
            <button
              type="button"
              onClick={handleDownloadGelsCSV}
              className="mb-6 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-700"
            >
              Download Generated Gels as csv
            </button>
            <div className="space-y-6">
              {paginatedGels.map((gel, gelIndex) => (
                <div key={gelIndex} className="border p-4 rounded-md shadow">
                  <h3 className="font-semibold mb-2">
                    Gel {(gelsPage - 1) * gelsPerPage + gelIndex + 1}
                  </h3>
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
            <Pagination
              currentPage={gelsPage}
              totalPages={gelsTotalPages}
              onPageChange={setGelsPage}
            />
          </div>
        )}

        {activeTab === "samples" && (
          <div>
            <h2 className="text-lg font-bold mb-2">Generated Export Table</h2>
            <GelTable
              rows={paginatedRows}
              onDownloadCSV={handleDownloadGelTableCSV}
            />
            <Pagination
              currentPage={samplesPage}
              totalPages={samplesTotalPages}
              onPageChange={setSamplesPage}
            />
          </div>
        )}
      </div>

      {/* no duplicates found, lower R corner */}
      {error && <ErrorPopup error={error} onClose={() => setError(null)} />}
      {success && !error && (
        <div
          className="fixed bottom-4 right-4 z-50 max-w-xs bg-green-100 border border-green-400 text-green-700 
               px-4 py-3 rounded shadow"
          role="alert"
        >
          <div className="flex justify-between items-center">
            <span>{success}</span>
            <button
              className="ml-2 font-bold text-green-700 focus:outline-none"
              onClick={() => setSuccess(null)}
              aria-label="Close success message"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
