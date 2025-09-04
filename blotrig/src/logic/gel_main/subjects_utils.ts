import Papa from "papaparse";
import { createSubjectsTable } from "../gel_logic";
import type { SubjectsTable } from "../models";

export function buildSubjectsTable(
  csvData: string[][],
  groupsCol: string,
  subjectsCol: string,
): SubjectsTable {
  const headers = csvData[0];
  const rows = csvData
    .slice(1)
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
  return createSubjectsTable(rows, groupsCol, subjectsCol);
}

export function subjectsTableToCsv(subjectsTable: SubjectsTable): string {
  const columns = Object.keys(subjectsTable);
  const colArrays = Object.values(subjectsTable);
  const maxLen = Math.max(...colArrays.map((arr) => arr.length));

  const rows = Array.from({ length: maxLen }, (_, i) => {
    const row: Record<string, string> = {};
    columns.forEach((col) => {
      row[col] = subjectsTable[col][i] ?? "";
    });
    return row;
  });

  return Papa.unparse(rows);
}
