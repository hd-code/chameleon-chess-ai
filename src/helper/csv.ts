export function toCSV<T>(data: T[]): string {
    let result = getHeader(data[0]);
    for (let i = 0, ie = data.length; i < ie; i++) {
        result += getRow(data[i]);
    }
    return result.slice(0, -1);
}

// -----------------------------------------------------------------------------

function getHeader<T>(data: T): string {
    const keys = Object.keys(data);
    return arrayToCSVRow(keys);
}

function getRow<T>(data: T): string {
    let result = [];
    for (const key in data) {
        result.push(data[key]);
    }
    return arrayToCSVRow(result);
}

function arrayToCSVRow(data: string[]|number[], divider = ',', escapeChar = '"'): string {
    let result = '';
    for (let i = 0, ie = data.length; i < ie; i++) {
        const item = data[i];
        const escape = typeof item === 'string' && item.search(divider) !== -1;
       
        if (escape) result += escapeChar;
        result += item;
        if (escape) result += escapeChar;
        result += divider;
    }
    result = result.slice(0, -1);
    result += '\n';
    return result;
}