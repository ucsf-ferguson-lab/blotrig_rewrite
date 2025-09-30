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

//round-robin shuffle with non-match adjacents
//same order as shown in subjects table
export function shuffleWithConstraints(headers: string[]): string[] {
  //parse headers into {prefix, time, original}
  const parseHeader = (h: string) => {
    const match = h.match(/(\S+)\s*(\d+dpi)/i);
    if (match) {
      return { original: h, prefix: match[1], time: match[2] };
    }
    return { original: h, prefix: h, time: "" };
  };

  const pool = headers.map(parseHeader);

  function backtrack(
    path: typeof pool,
    remaining: typeof pool,
  ): string[] | null {
    if (remaining.length === 0) {
      return path.map((p) => p.original);
    }

    const last = path[path.length - 1];
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];

      //adjacents constraint: no same prefix OR same time
      if (
        last &&
        (candidate.prefix === last.prefix || candidate.time === last.time)
      ) {
        continue;
      }

      const newRemaining = [
        ...remaining.slice(0, i),
        ...remaining.slice(i + 1),
      ];
      const result = backtrack([...path, candidate], newRemaining);
      if (result) return result; // success
    }

    return null; //trigger backtrack
  }

  const shuffled = backtrack([], pool);
  if (!shuffled) {
    throw new Error("No valid shuffle possible with given constraints.");
  }
  return shuffled;
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
