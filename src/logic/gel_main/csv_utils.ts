import Papa, { type ParseResult } from "papaparse";

export function parseCsvFile(
  file: File,
  onComplete: (data: string[][], headers: string[]) => void,
) {
  Papa.parse<string[]>(file, {
    complete: (results: ParseResult<string[]>) => {
      if (results.data.length > 0) {
        onComplete(results.data, results.data[0]);
      } else {
        onComplete([], []);
      }
    },
    skipEmptyLines: true,
  });
}

export function downloadCsv(content: string, fileName: string) {
  const blob: Blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url: string = URL.createObjectURL(blob);
  const a: HTMLAnchorElement = document.createElement("a");

  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}
