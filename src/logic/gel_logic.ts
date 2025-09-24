import type { DataRow, SubjectsTable } from "./models";

export function colnamesReplaceSpaces(
  data: DataRow[],
  column: string,
): DataRow[] {
  return data.map((row) => ({
    ...row,
    [column]: row[column].replace(/ /g, "_"),
  }));
}

export function createSubjectsTable(
  data: DataRow[],
  conditionCol: string,
  numberCol: string,
): SubjectsTable {
  const grouped: SubjectsTable = {};

  data.forEach((row) => {
    const key = row[conditionCol];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row[numberCol]);
  });

  return grouped;
}
