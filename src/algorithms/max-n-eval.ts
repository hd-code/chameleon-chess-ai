import { IGameState, isGameOver, getNextGameStates } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore, findMaxScoreIndex } from './helper/player-score';
import { FEvalFunc, countMoves, countPawns, countPawns100Moves } from './helper/eval-func';
import { IAlgorithmReturn } from '../types';


// TODO: ....

type ELimitBy = 'depth'|'time';

// -----------------------------------------------------------------------------
// Wrapper for Testing Framework
// -----------------------------------------------------------------------------

export function evalMoves(gameState: IGameState, limitBy: ELimitBy, limit: number): IAlgorithmReturn {
    const evalFunc = countMoves;
    return limitBy === 'depth'
        ? staticDepth(gameState, limit, evalFunc)
        : iterativeDeepening(gameState, limit, evalFunc);
}

export function evalPawns(gameState: IGameState, limitBy: ELimitBy, limit: number): IAlgorithmReturn {
    const evalFunc = countPawns;
    return limitBy === 'depth'
        ? staticDepth(gameState, limit, evalFunc)
        : iterativeDeepening(gameState, limit, evalFunc);
}

export function evalPawns100Moves(gameState: IGameState, limitBy: ELimitBy, limit: number): IAlgorithmReturn {
    const evalFunc = countPawns100Moves;
    return limitBy === 'depth'
        ? staticDepth(gameState, limit, evalFunc)
        : iterativeDeepening(gameState, limit, evalFunc);
}

// -----------------------------------------------------------------------------

function staticDepth(gameState: IGameState, depth: number, evalFunc: FEvalFunc): IAlgorithmReturn {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);

    const begin = Date.now();

    let bestScore = _maxN(nextGSs[0], depth, evalFunc);
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _maxN(nextGSs[i], depth, evalFunc);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
            bestIndex = i;
        }
    }

    const end = Date.now();

    return { gameState: nextGSs[bestIndex], depth, time: end - begin };
}

function iterativeDeepening(gameState: IGameState, time: number, evalFunc: FEvalFunc): IAlgorithmReturn {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    const numOfMoves = nextGSs.length;

    let move = 0;
    let depth = 1;

    const begin = Date.now();
    let scores = nextGSs.map(gs => _maxN(gs, 0, evalFunc));

    while (Date.now() - begin < time && depth < 20) {
        scores[move] = _maxN(nextGSs[move], depth, evalFunc);

        if (++move >= numOfMoves) {
            move = 0;
            depth += 1;
        }
    }
    const end = Date.now();

    const bestIndex = findMaxScoreIndex(scores, player);

    return { gameState: nextGSs[bestIndex], depth: depth + (move / numOfMoves), time: end - begin };
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
// -----------------------------------------------------------------------------

function _maxN(gameState: IGameState, depth: number, evalFunc: FEvalFunc): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalFunc(gameState);
        return counterweightOpponents(score);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = _maxN(nextGSs[0], depth - 1, evalFunc);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _maxN(nextGSs[i], depth - 1, evalFunc);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}

function counterweightOpponents(score: TPlayerScore): TPlayerScore {
    const sum = sumScore(score);
    let result = {...score};
    for (const key in score) {
        result[key] = 2 * score[key] - sum;
    }
    return result;
}