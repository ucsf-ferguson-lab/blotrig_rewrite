import { type GelTableRow, type SubjectsTable } from "./models";

export function buildGelTableRows(
  subjectsTable: SubjectsTable,
  gels: (string | number)[][],
  numReplicates: number,
): GelTableRow[] {
  const groupNames = Object.keys(subjectsTable);
  const baseRows: Omit<GelTableRow, "technical_replicate">[] = [];

  gels.forEach((gel, gelIdx) => {
    gel.forEach((subjectId, laneIdx) => {
      const subjectIdStr = String(subjectId);

      let group: string;
      if (subjectIdStr === "NA") {
        group = "Padding"; //explicitly identify padding
      } else if (subjectIdStr === "Ladder") {
        group = "Ladder";
      } else {
        group =
          groupNames.find((grp) => subjectsTable[grp].includes(subjectIdStr)) ??
          "Unknown";
      }

      baseRows.push({
        sample_id: subjectIdStr,
        group,
        gel: gelIdx + 1,
        lane: laneIdx + 1,
        protein_quant: "",
      });
    });
  });

  return addTechnicalReplicates(baseRows, numReplicates);
}

//show all rows for replicate 1 before 2
function addTechnicalReplicates(
  rows: Omit<GelTableRow, "technical_replicate">[],
  numReplicates: number,
): GelTableRow[] {
  const replicatedRows: GelTableRow[] = [];

  for (let r = 1; r <= numReplicates; r++) {
    rows.forEach((row) => {
      replicatedRows.push({
        ...row,
        technical_replicate: r,
      });
    });
  }

  return replicatedRows;
}
