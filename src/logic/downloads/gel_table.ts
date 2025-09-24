import type { GelTableRow } from "../models";
import { downloadCsv } from "../gel_main/csv_utils";

export function downloadGelTableCSV(
  gelTableRows: GelTableRow[],
  setError: (msg: string | null) => void,
) {
  if (gelTableRows.length === 0) {
    setError("No gel table data to download.");
    return;
  }
  const headers = [
    "Sample ID",
    "Group",
    "Gel",
    "Technical Replication",
    "Lane",
    "Protein Quant",
  ];

  const csvRows = [
    headers.join(","),
    ...gelTableRows.map((row) =>
      [
        row.sample_id,
        row.group,
        row.gel,
        row.technical_replicate,
        row.lane,
        row.protein_quant,
      ]
        .map((value) => `"${value}"`)
        .join(","),
    ),
  ];

  const csvString = csvRows.join("\n");
  downloadCsv(csvString, "gel_table.csv");
}
