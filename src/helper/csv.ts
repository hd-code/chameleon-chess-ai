export function toCSV<T>(data: T[], noHeader?: boolean): string {
    let result = '';

    if (!noHeader) {
        result += getHeader(data[0]);
    }

    for (let i = 0, ie = data.length; i < ie; i++) {
        result += getData(data[i]);
    }

    return result.slice(0, -1);
}

// -----------------------------------------------------------------------------

function getHeader<T>(obj: T): string {
    const result = Object.keys(obj);
    return toCSVLine(result);
}

function getData<T>(obj: T): string {
    const result = Object.values(obj);
    return toCSVLine(result);
}

function toCSVLine<T>(array: T[]): string {
    let result = '';
    for (let i = 0, ie = array.length; i < ie; i++) {
        result += escape('' + array[i]) + ',';
    }
    return result.slice(0, -1) + '\n';
}

function escape(string: string): string {
    return hasToBeEscaped(string)
        ? '"' + string.replace(/"/g, '""') + '"'
        : string;
}

function hasToBeEscaped(string: string): boolean {
    return string.includes(',') || string.includes('"');
}