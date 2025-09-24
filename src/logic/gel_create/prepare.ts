//create single list from all IDs (snake order)
export function idSingleList(...lists: string[][]): string[] {
  const maxLength = Math.max(...lists.map((l) => l.length));
  const result: string[] = [];

  for (let i = 0; i < maxLength; i++) {
    for (const list of lists) {
      if (i < list.length) {
        result.push(list[i]);
      }
    }
  }

  return result;
}
