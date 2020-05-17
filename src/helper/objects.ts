export function flattenArray<T>(array: T[][]): T[] {
    return array.reduce((result, row) => result.concat(row));
}