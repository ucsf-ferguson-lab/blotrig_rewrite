import { useLocation, useNavigate } from "react-router-dom";

import type { SubjectsTable } from "../logic/models";
import { createGelWrapper } from "../logic/gel_create/split";

export function GelCreate() {
  const location = useLocation();
  const navigate = useNavigate();

  //read subjectsTable from prior page
  const subjectsTable: SubjectsTable = location.state?.subjectsTable;

  if (!subjectsTable || Object.keys(subjectsTable).length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">No Subjects Table Found</h2>
        <p className="mb-4">
          You must create a subjects table before continuing.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const allSubjects: string[][] = Object.values(subjectsTable);

  //todo: get numLanes from number input
  const gels: (string | number)[][] = createGelWrapper(allSubjects, 10 - 1);

  //download as csv
  function handleDownloadCSV() {
    const csvContent: string = gels
      .map((gel) => gel.map((lane) => `"${lane}"`).join(","))
      .join("\n");

    const blob: Blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const downloadUrl: string = URL.createObjectURL(blob);

    const link: HTMLAnchorElement = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "gel_data.csv");

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(downloadUrl);
  }

  //show rendered gels
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">
        Generated gels
      </h2>

      <button
        type="button"
        onClick={handleDownloadCSV}
        className="mb-6 px-4 py-2 border rounded bg-green-600 text-white hover:bg-green-700"
      >
        Download gels as CSV
      </button>

      <div className="space-y-6">
        {gels.map((gel, gelIndex) => (
          <div key={gelIndex} className="border p-4 rounded-md shadow">
            <h3 className="font-semibold mb-2">Gel {gelIndex + 1}</h3>

            <div className="grid grid-cols-10 gap-2">
              {gel.map((lane, laneIndex) => (
                <div
                  key={laneIndex}
                  className="border px-2 py-1 text-center bg-gray-50"
                >
                  {lane}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-6 px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
      >
        Back
      </button>
    </div>
  );
}
