export type DataRow = { [key: string]: string };

export type SubjectsTable = Record<string, string[]>;

export type JsonTableProps = {
  data: SubjectsTable;
};

export interface GelTableRow {
  sample_id: string;
  group: string;
  gel: number;
  technical_replicate: number;
  lane: number;
  protein_quant: string;
}
