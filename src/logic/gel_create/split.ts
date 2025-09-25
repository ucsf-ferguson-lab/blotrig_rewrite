type ResultArray = (string | number)[];

//create gel with round-robin approach, each gel must have 1 representative from each group
//not optimized to use least gels
export function createGelUnoptimized(
  groups: string[][],
  numLanes: number,
): ResultArray[] {
  //track current index per group for next ID to use
  const indices = new Array(groups.length).fill(0);
  const result: ResultArray[] = [];

  //continue until all ID from all groups used
  let done: boolean = false;

  while (!done) {
    const currentArray: ResultArray = [];
    let lanesUsed: number = 0;

    for (let g = 0; g < groups.length; g++) {
      if (lanesUsed >= numLanes) {
        break; //next gel
      }

      if (indices[g] < groups[g].length) {
        currentArray.push(groups[g][indices[g]]);
        indices[g]++;
      } else {
        currentArray.push("NA");
      }

      lanesUsed++;
    }

    //break conditional, push remaining to another gel
    if (currentArray.length === 0) {
      done = true;
    } else {
      result.push(currentArray);
      done = indices.every((idx, g) => idx >= groups[g].length);
    }
  }

  return result;
}

//optimize use least number gels, include empty spaces
export function optimizeGel(
  arrays: Array<Array<string | number>>,
  numLanes: number,
): Array<Array<string | number>> {
  const result: Array<Array<string | number>> = [];
  let current: Array<string | number> = [];

  for (const arr of arrays) {
    if (current.length + arr.length > numLanes) {
      while (current.length < numLanes) {
        current.push("NA");
      }
      result.push(current);
      current = [];
    }
    current = current.concat(arr);
  }

  if (current.length > 0) {
    while (current.length < numLanes) {
      current.push("NA");
    }
    result.push(current);
  }

  return result;
}

//add ladder to index 0, add equal padding after ladder
export function addLadderCentered(
  arrays: Array<Array<string | number>>,
): Array<Array<string | number>> {
  return arrays.map((innerArray) => {
    //rm trailing NA, keep index[0]
    const content: (string | number)[] = innerArray.filter(
      (item, i) => item !== "NA" || i === 0,
    );

    const totalLanes: number = innerArray.length; //orig lane count

    //content after Ladder will be everything except NA (preserve order)
    const actualContent: (string | number)[] = content.filter(
      (item) => item !== "NA" && item !== "Ladder",
    );
    const naCount: number = totalLanes - 1 - actualContent.length;

    //add padding
    const leftPad: number = Math.floor(naCount / 2);
    const rightPad: number = naCount - leftPad;

    return [
      "Ladder",
      ...Array(leftPad).fill("NA"),
      ...actualContent,
      ...Array(rightPad).fill("NA"),
    ];
  });
}

export function createGelWrapper(
  groups: string[][],
  numLanes: number,
): Array<Array<string | number>> {
  const numGroups: number = groups.length; //validate numLanes

  if (numLanes < 2) {
    throw new Error("Number of lanes must be at least 2.");
  }

  if (numLanes < numGroups) {
    throw new Error(
      `Number of lanes (${numLanes}) cannot be less than number of groups (${numGroups}).`,
    );
  }

  const unoptimized = createGelUnoptimized(groups, numLanes);
  const optimized = optimizeGel(unoptimized, numLanes);

  return addLadderCentered(optimized);
}
