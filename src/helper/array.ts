export function flattenArray<T>(array: T[][]): T[] {
    return array.reduce((result, row) => result.concat(row));
}

export function getPermutations<T>(array: T[], noDuplicates = false): T[][] {
    const permutations = permuteArray(array);
    return noDuplicates ? removeDuplicates(permutations) : permutations;
}

// -----------------------------------------------------------------------------

function permuteArray<T>(array: T[]): T[][] {
    if (array.length <= 1) return [array];

    let result: T[][] = [];
    for (let i = 0, ie = array.length; i < ie; i++) {
        const first = array[i];
        const rest = array.filter((_,index) => i !== index);

        const permutations = permuteArray(rest);

        const tmpResult = permutations.map(per => [first, ...per]);
        result = result.concat(tmpResult);
    }
    return result;
}

function removeDuplicates<T>(tuples: T[][]): T[][] {
    return tuples.filter((tuple, index, tuples) => {
        for (let i = index + 1, ie = tuples.length; i < ie; i++) {
            if (isSameTuple(tuple, tuples[i])) return false;
        }
        return true;
    });
}

function isSameTuple<T>(a: T[], b: T[]): boolean {
    if (a.length !== b.length) return false;
    return a.every((_, i) => a[i] === b[i]);
}