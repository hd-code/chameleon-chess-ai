import * as Algorithms from './src/algorithms';
import { playSession, ISessionResult, evalSession } from './src/session';
import { FAlgorithm, EMode } from './src/types';

import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

// -----------------------------------------------------------------------------

const DATA_DIR = path.resolve(__dirname, 'data');

// -----------------------------------------------------------------------------

main('eval-func-all-d3', [
    Algorithms.evalPawns,
    Algorithms.evalPawn100Moves,
    Algorithms.evalPawn100Roles,
    Algorithms.evalPawn10Roles,
], 'depth', 3);

main('eval-func-all-t100', [
    Algorithms.evalPawns,
    Algorithms.evalPawn100Moves,
    Algorithms.evalPawn100Roles,
    Algorithms.evalPawn10Roles,
], 'time', 100);

main('eval-func-pawn10-vs-pawn100-d3', [
    Algorithms.evalPawn100Roles,
    Algorithms.evalPawn10Roles,
], 'depth', 3);

main('paranoid-d3', [
    Algorithms.paranoid,
    Algorithms.paranoidNorm,
], 'depth', 3);

main('paranoid-t100', [
    Algorithms.paranoid,
    Algorithms.paranoidNorm,
], 'time', 100);

main('paranoid-t1000', [
    Algorithms.paranoid,
    Algorithms.paranoidNorm,
], 'time', 1000);

main('hypermax-d3', [
    Algorithms.hypermax,
    Algorithms.hypermaxNorm,
], 'depth', 3);

main('hypermax-t100', [
    Algorithms.hypermax,
    Algorithms.hypermaxNorm,
], 'time', 100);

main('hypermax-t1000', [
    Algorithms.hypermax,
    Algorithms.hypermaxNorm,
], 'time', 1000);

main('all-d3', [
    Algorithms.maxN,
    Algorithms.maxNIS,
    Algorithms.paranoidNorm,
    Algorithms.hypermax,
], 'depth', 3);

main('all-d4', [
    Algorithms.maxN,
    Algorithms.maxNIS,
    Algorithms.paranoidNorm,
    Algorithms.hypermax,
], 'depth', 4);

main('all-t100', [
    Algorithms.maxN,
    Algorithms.maxNIS,
    Algorithms.paranoidNorm,
    Algorithms.hypermax,
], 'time', 100);

main('all-t1000', [
    Algorithms.maxN,
    Algorithms.maxNIS,
    Algorithms.paranoidNorm,
    Algorithms.hypermax,
], 'time', 1000);

main('max-n-vs-is-d3', [
    Algorithms.maxN,
    Algorithms.maxNIS,
], 'depth', 3);

main('max-n-vs-is-t100', [
    Algorithms.maxN,
    Algorithms.maxNIS,
], 'time', 100);

main('max-n-vs-is-t1000', [
    Algorithms.maxN,
    Algorithms.maxNIS,
], 'time', 1000);

main('max-nis-vs-paranoid-t1000', [
    Algorithms.maxNIS,
    Algorithms.paranoidNorm,
], 'time', 1000);

main('max-nis-vs-hypermax-t1000', [
    Algorithms.maxNIS,
    Algorithms.hypermax,
], 'time', 1000);

main('hypermax-vs-paranoid-t1000', [
    Algorithms.hypermax,
    Algorithms.paranoidNorm,
], 'time', 1000);

// main('all-t10000', [
//     Algorithms.maxN,
//     Algorithms.maxNIS,
//     Algorithms.paranoidNorm,
//     Algorithms.hypermax,
// ], 'time', 10000);

// -----------------------------------------------------------------------------
// Functions
// -----------------------------------------------------------------------------

function main(name: string, algorithms: FAlgorithm[], mode: EMode, modeValue: number) {
    let session: any = loadData(name);
    let cached = true;

    if (session === null) {
        cached = false;
        session = playSession(algorithms, mode, modeValue);
        saveData(name, session);
    }

    const sessionResult = evalSession(session);

    printSessionHeader(name, cached);
    printSessionResult(sessionResult);
}

function loadData<T>(fileName: string): T|null {
    const filePath = path.join(DATA_DIR, fileName + '.json');
    try {
        const data = readFileSync(filePath);
        return JSON.parse(data as any);
    }
    catch (e) {
        return null;
    }
}

function saveData<T>(fileName: string, data: T) {
    try {
        const filePath = path.join(DATA_DIR, fileName + '.json');
        writeFileSync(filePath, JSON.stringify(data));
    } catch (e) {
        console.log(data);
        console.error(e);
    }
}

function printSessionHeader(name: string, cached: boolean) {
    console.log('\n-------------------------------------------------------------\n');
    console.log('#####', name, cached ? '(cached)' : '', '#####');
}

function printSessionResult(session: ISessionResult) {
    const { algorithms, ...meta } = session;
    console.table(algorithms);
    console.log(meta);
}