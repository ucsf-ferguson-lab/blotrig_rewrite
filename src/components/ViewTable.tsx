import type { JsonTableProps } from "../logic/models";

export function ConvertJsonToTable({ data }: JsonTableProps) {
  if (!data || Object.keys(data).length === 0) {
    return <p>No data available</p>;
  }

  //if data is object of arrays (columns), convert to row-based array of objects
  let rows: Record<string, string>[] = [];
  if (!Array.isArray(data)) {
    const columns = Object.keys(data);
    const colArrays = Object.values(data).filter(Array.isArray);
    const maxLength = Math.max(...colArrays.map((col) => col.length));

    for (let i = 0; i < maxLength; i++) {
      const row: Record<string, string> = {};
      columns.forEach((col) => {
        row[col] = Array.isArray(data[col]) ? (data[col][i] ?? "") : "";
      });
      rows.push(row);
    }
  } else {
    rows = data;
  }

  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full text-sm">
      <thead className="bg-gray-100">
        <tr>
          {columns.map((col) => (
            <th key={col} className="border border-gray-400 px-2 py-1">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => (
              <td key={col} className="border border-gray-400 px-2 py-1">
                {String(row[col] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
