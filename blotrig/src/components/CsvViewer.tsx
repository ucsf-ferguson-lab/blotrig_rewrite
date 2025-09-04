export function CsvViewer({ csvData }: { csvData: string[][] }) {
  if (csvData.length === 0) {
    return <p className="text-gray-500 italic">No CSV uploaded yet.</p>;
  }

  return (
    <div className="grow overflow-auto">
      <div className="overflow-x-auto overflow-y-auto rounded-lg shadow-lg h-full border border-gray-200">
        <table className="min-w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">
            <tr>
              {csvData[0].map((header, i) => (
                <th
                  key={i}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-700 tracking-wider border-b border-gray-200"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {csvData.slice(1).map((row, i) => (
              <tr
                key={i}
                className={`transition-colors duration-200 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className="px-6 py-3 text-sm text-gray-700 whitespace-pre-wrap border-b border-gray-100"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
