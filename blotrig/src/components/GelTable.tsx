import type { GelTableRow } from "../logic/models";

export function GelTable({ rows }: { rows: GelTableRow[] }) {
  return (
    <table
      className="w-full border mt-4"
      style={{ borderCollapse: "collapse" }}
    >
      <thead>
        <tr>
          <th className="border p-2">Sample ID</th>
          <th className="border p-2">Group</th>
          <th className="border p-2">Gel</th>
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
            <td className="border p-2">{row.lane}</td>
            <td className="border p-2">{row.protein_quant}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
