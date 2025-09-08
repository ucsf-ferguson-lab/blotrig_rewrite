export type DataRow = { [key: string]: string };

export type SubjectsTable = Record<string, string[]>;

export type JsonTableProps = {
  data: SubjectsTable;
};
