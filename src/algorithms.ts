import { IGameState, getNextGameStates } from 'chameleon-chess-logic';
import { IAlgorithmReturn } from './types';
import * as max from './algorithms/max-n';
import * as nor from './algorithms/max-n-normalize';
import * as mis from './algorithms/max-n-is';
import * as hyp from './algorithms/hypermax';
import * as par from './algorithms/paranoid';

// -----------------------------------------------------------------------------

export function maxN(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _maxN(gameState, maxDepth, maxTime);
}

export function maxNNorm(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
    return _maxNNorm(gameState, maxDepth, maxTime);
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

const _maxN = factory(max);

const _maxNNorm = factory(nor);

const _maxNIS = factory(mis);

const _hypermax = factory(hyp);

const _paranoid = factory(par);

// -----------------------------------------------------------------------------

/**
 * Algorithms have to implement this interface. Then the `factory()` function can
 * be used to create an algorithm instance, which is used in the testing scripts.
 * 
 * S..scores, A..additional, P..parameter
 */
export interface IAlgorithmFactory <S,A,P>{
    initScores: (currentGS: IGameState, nextGSs: IGameState[], param?: P) => { scores: S[], additional: A };
    calcNextScore: (gameState: IGameState, depth: number, additional: A) => { score: S, additional: A };
    nextDepth: (additional: A) => A;
    findBestScoreIndex: (scores: S[], additional: A) => number;
}

function factory<S,A,P>({ initScores, calcNextScore, nextDepth, findBestScoreIndex }: IAlgorithmFactory<S,A,P>, param?: P) {
    function main(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
        const nextGSs = getNextGameStates(gameState);
        const numOfMoves = nextGSs.length;
    
        let move = 0;
        let depth = 1;
    
        const begin = Date.now();
    
        // ------------------------------
        let { scores, additional } = initScores(gameState, nextGSs, param);
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