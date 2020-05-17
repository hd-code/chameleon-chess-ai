import type { IGSMoves } from './random-games-by-moves';
import orderedGamesByMove from '../../data/random-games-by-moves.json';
import { makeMoveMaxN } from '../max-n-orig';
import { toCSV } from '../helper/csv';
import * as fs from 'fs';

// -----------------------------------------------------------------------------

const maxDepth = 30;
const maxDuration = 1000;

const dirname = __dirname + '/' + '../../data/';
const filename = 'max-n-performance.csv';

let result: IResult[] = [];
for (let i = 1; i <= maxDepth; i++) {
    result.push({
        depth: i,
        numOfMovesWhenTooSlow: findNumOfMovesWhenTooSlow(i, maxDuration, orderedGamesByMove)
    });

    console.log('depth:', i, 'tested');

    const csv = toCSV(result);
    fs.writeFileSync(dirname + filename, csv);
}

// -----------------------------------------------------------------------------

interface IResult {
    depth: number;
    numOfMovesWhenTooSlow: number;
}

function findNumOfMovesWhenTooSlow(depth: number, maxDuration: number, orderedGSMs: IGSMoves[]): number {
    for (let i = 0, ie = orderedGSMs.length; i < ie; i++) {
        const begin = Date.now();
        makeMoveMaxN(orderedGSMs[i].gs, depth);
        const end = Date.now();

        if (end - begin > maxDuration) return orderedGSMs[i].numOfMoves;
    }
    return -1;
}