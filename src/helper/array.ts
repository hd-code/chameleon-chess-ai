export function flattenArray<T>(array: T[][]): T[] {
    return array.reduce((result, row) => result.concat(row));
}

export function getPermutations<T>(array: T[]): T[][] {
    if (array.length <= 1) return [array];

    let result: T[][] = [];
    for (let i = 0, ie = array.length; i < ie; i++) {
        const first = array[i];
        const rest = array.filter((_,index) => i !== index);

        const permutations = getPermutations(rest);

        const tmpResult = permutations.map(per => [first, ...per]);
        result = result.concat(tmpResult);
    }
    return result;
}