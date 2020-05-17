import { IGameState, isGameOver, getMoves, getNextGameStates, EPlayer } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

export type TPlayerScore = {[player in EPlayer]: number}

export function getZeroScore(): TPlayerScore {
    return { 0: 0, 1: 0, 2: 0, 3: 0 };
}

export function sumScore(score: TPlayerScore): number {
    return score[0] + score[1] + score[2] + score[3];
}

// -----------------------------------------------------------------------------

export type FEvalFunc = (gameState: IGameState) => TPlayerScore;

export function evalGameState(gameState: IGameState): TPlayerScore {
    return getZeroScore();
}

// -----------------------------------------------------------------------------

export function evalPawns(gameState: IGameState, depth: number): IGameState {
    return maxN(gameState, depth, countPawns);
}

export function evalMoves(gameState: IGameState, depth: number): IGameState {
    return maxN(gameState, depth, countMoves);
}

export function evalPawns100Moves(gameState: IGameState, depth: number): IGameState {
    return maxN(gameState, depth, countPawns100Moves);
}

// -----------------------------------------------------------------------------

function countPawns(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += 1;
    }

    return result;
}

function countMoves(gameState: IGameState): TPlayerScore {
    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        const numOfMoves = getMoves(gameState, i).length;
        result[pawn.player] += numOfMoves;
    }

    return result;
}

function countPawns100Moves(gameState: IGameState): TPlayerScore {
    const PAWN_VALUE = 100;
    const MOVE_VALUE = 1;

    let result = getZeroScore();

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] += PAWN_VALUE;

        const numOfMoves = getMoves(gameState, i).length;
        result[pawn.player] += numOfMoves * MOVE_VALUE;
    }

    return result;
}

// -----------------------------------------------------------------------------

function maxN(gameState: IGameState, depth: number, evalFunc: FEvalFunc): IGameState {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);

    let bestScore = _maxN(nextGSs[0], depth - 1, evalFunc);
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _maxN(nextGSs[i], depth - 1, evalFunc);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
            bestIndex = i;
        }
    }

    return nextGSs[bestIndex];
}

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