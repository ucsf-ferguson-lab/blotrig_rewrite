import { type GelTableRow, type SubjectsTable } from "./models";

export function buildGelTableRows(
  subjectsTable: SubjectsTable,
  gels: (string | number)[][],
) {
  const groupNames = Object.keys(subjectsTable);
  const rows: GelTableRow[] = [];

  gels.forEach((gel, gelIdx) => {
    gel.forEach((subjectId, laneIdx) => {
      const subjectIdStr = String(subjectId);

      //find group, may be undefined for ladder
      const group = groupNames.find((grp) =>
        subjectsTable[grp].includes(subjectIdStr),
      );

      //include ladder (group can be undefined, lane still shown)
      rows.push({
        sample_id: subjectIdStr,
        group: group ?? "Ladder",
        gel: gelIdx + 1,
        lane: laneIdx + 1,
        protein_quant: "",
      });
    });
  });

  return rows;
}
