import type { GelTableRow } from "../logic/models";

interface GelTableProps {
  rows: GelTableRow[];
  onDownloadCSV: () => void;
}

export function GelTable({ rows, onDownloadCSV }: GelTableProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onDownloadCSV}
        className="mb-6 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-700"
      >
        Download export table as csv
      </button>

      <table className="w-full border" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th className="border p-2">Sample ID</th>
            <th className="border p-2">Group</th>
            <th className="border p-2">Gel</th>
            <th className="border p-2">Technical Replication</th>
            <th className="border p-2">Lane</th>
            <th className="border p-2">Protein Quant</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td className="border p-2">{row.sample_id}</td>
              <td className="border p-2">{row.group}</td>
              <td className="border p-2">{row.gel}</td>
              <td className="border p-2">{row.technical_replicate}</td>
              <td className="border p-2">{row.lane}</td>
              <td className="border p-2">{row.protein_quant}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
