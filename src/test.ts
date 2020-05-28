import { playSession, evalSession } from './session';
import * as algorithms from './algorithms';
import { FAlgorithm } from './types';

// -----------------------------------------------------------------------------

function main(algorithms: FAlgorithm[], maxDepth: number, maxTime: number) {
    const session = playSession(algorithms, maxDepth, maxTime);
    const { algorithms: algoResult, ...meta } = evalSession(session);
    console.log(meta);
    console.table(algoResult);
}

const maxDepth = 20;
const maxTime  = 300;

// -----------------------------------------------------------------------------

// main([
//     algorithms.evalPawns,
//     algorithms.evalPawns100Moves,
//     algorithms.evalPawn10Roles,
//     algorithms.evalPawn100Roles,
// ], maxDepth, maxTime);

// main([
//     algorithms.paranoid,
//     algorithms.paranoidNorm,
// ], maxDepth, maxTime);

// main([
//     algorithms.hypermax,
//     algorithms.hypermaxNorm,
// ], maxDepth, maxTime);

main([
    algorithms.evalPawn100Roles,
    algorithms.maxNIS,
    algorithms.hypermax,
    algorithms.paranoidNorm,
], maxDepth, maxTime);