import { useLocation, useNavigate } from "react-router-dom";

import type { SubjectsTable } from "../logic/models";
import { idSingleList } from "../logic/gel_create/prepare";

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

  const lists: string[][] = Object.values(subjectsTable);
  const mergedList: string[] = idSingleList(...lists);

  // show subjects table
  return (
    <div className="p-6">
      <h2 className="text-lg font-bold mb-4">Create from Subjects Table</h2>

      <h3 className="mb-2 font-semibold">Merged ID List:</h3>
      <ul className="mb-4 list-disc list-inside">{mergedList.join(", ")}</ul>

      <div>
        <p>Stats</p>
        <p>Length: {mergedList.length}</p>
      </div>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 border rounded bg-gray-200 hover:bg-gray-300"
      >
        Back
      </button>
    </div>
  );
}
