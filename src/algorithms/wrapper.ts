import { IGameState, getNextGameStates } from 'chameleon-chess-logic';
import { IAlgorithmReturn } from '../types';
import * as max from './max-n';
import * as mis from './max-n-is';
import * as hyp from './hypermax';
import * as par from './paranoid';

// -----------------------------------------------------------------------------

export function maxN(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _maxN(gameState, maxDepth, maxTime);
}

export function maxNIS(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _maxNIS(gameState, maxDepth, maxTime);
}

export function hypermax(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _hypermax(gameState, maxDepth, maxTime);
}

export function paranoid(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _paranoid(gameState, maxDepth, maxTime);
}

// -----------------------------------------------------------------------------

let _maxN = factory(
    max.initScores, max.calcNextScore,
    max.nextDepth,  max.findBestScoreIndex
);

let _maxNIS = factory(
    mis.initScores, mis.calcNextScore,
    mis.nextDepth,  mis.findBestScoreIndex
);

let _hypermax = factory(
    hyp.initScores, hyp.calcNextScore,
    hyp.nextDepth,  hyp.findBestScoreIndex
);

let _paranoid = factory(
    par.initScores, par.calcNextScore,
    par.nextDepth,  par.findBestScoreIndex
);

// -----------------------------------------------------------------------------

function factory<S,A>(
    initScores: (currentGS: IGameState, nextGSs: IGameState[]) => { scores: S[], additional: A },
    calcNextScore: (gameState: IGameState, depth: number, additional: A) => { score: S, additional: A },
    nextDepth: (additional: A) => A,
    findBestScoreIndex: (scores: S[], additional: A) => number,
) {
    function main(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
        const nextGSs = getNextGameStates(gameState);
        const numOfMoves = nextGSs.length;
    
        let move = 0;
        let depth = 1;
    
        const begin = Date.now();
    
        // ------------------------------
        let { scores, additional } = initScores(gameState, nextGSs);
        // ------------------------------
    
        while (Date.now() - begin < maxTime && depth < maxDepth) {

            // ------------------------------
            const { score, additional: tmp } = calcNextScore(nextGSs[move], depth, additional);
            scores[move] = score;
            additional = tmp;
            // ------------------------------
    
            if (++move >= numOfMoves) {
                move = 0;
                depth += 1;
    
                // ------------------------------
                additional = nextDepth(additional);
                // ------------------------------
            }
        }

        const end = Date.now();
    
        // ------------------------------
        const bestIndex = findBestScoreIndex(scores, additional);
        // ------------------------------
    
        return { gameState: nextGSs[bestIndex], depth: depth + (move / numOfMoves), time: end - begin };
    }

    return main;
}