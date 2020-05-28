export function add(x: number, y: number): number {
    return x + y;
}

export function sub(x: number, y: number): number {
    return x - y;
}

export function sum(n: number[]): number {
    return n.reduce(add, 0);
}

export function avg(n: number[]): number {
    if (n.length === 0) {
        return 0;
    }

    return sum(n) / n.length;
}

export function median(_n: number[]): number {
    let n = [..._n];
    n.sort(sub);

    const half = Math.floor(n.length / 2);

    if (n.length % 2) {
        return n[half];
    }

    return (n[half - 1] + n[half]) / 2;
}