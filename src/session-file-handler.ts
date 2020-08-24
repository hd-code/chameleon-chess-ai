/**
 * @file
 * This file will care for the file handling of a session. Session results are
 * stored and retrieved from the `data` directory. This file offers a convenient
 * `doSession` function, which will play session if it was not played before.
 */

import * as fs from 'fs';
import * as path from 'path';

import { EMode } from './algorithm/factory';
import { MNameAlgorithm } from './game';
import { playSession, evalSession, ISessionResult } from './session';

// -----------------------------------------------------------------------------

/** Will do a session and store it to the `data` directory. If the session is
 * called again, it will just retrieved the stored data. */
export function doSession(name: string, algorithms: MNameAlgorithm, mode: EMode, modeValue: number) {
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

// -----------------------------------------------------------------------------

const dataDir = path.resolve(__dirname, '..', 'data');

function loadData<T>(fileName: string): T|null {
    const filePath = path.join(dataDir, fileName + '.json');
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data as any);
    }
    catch (e) {
        return null;
    }
}

function saveData<T>(fileName: string, data: T) {
    try {
        const filePath = path.join(dataDir, fileName + '.json');
        fs.writeFileSync(filePath, JSON.stringify(data));
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