import { IGameState, EPlayer, isGameOver, getNextGameStates } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore, calcAbsoluteScore } from './player-score'

// -----------------------------------------------------------------------------

export function evalHypermax(gameState: IGameState, depth: number): TPlayerScore {
    const aux = getAuxValues(gameState);
    const initialAlpha = getInitialAlpha(aux);
    return hypermax(gameState, depth, initialAlpha, aux);
}

// -----------------------------------------------------------------------------

const BASE_SCORE: TPlayerScore = { 0:0, 1:0, 2:0, 3:0 };
const INIT_VAL = -9999;

interface IAuxValues {
    numOfPlayers: number;
    evalPlayers: {[player in EPlayer]: boolean};
}

function getAuxValues(gameState: IGameState): IAuxValues {
    let numOfPlayers = 0;
    let evalPlayers = { 0:false, 1:false, 2:false, 3:false };

    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        evalPlayers[pawn.player] = true;
    }

    for (const key in evalPlayers) {
        if (evalPlayers[key]) numOfPlayers += 1;
    }

    return { numOfPlayers, evalPlayers };
}

function getInitialAlpha(aux: IAuxValues): TPlayerScore {
    let result = { ...BASE_SCORE };
    for (const key in aux.evalPlayers) {
        if (aux.evalPlayers[key]) result[key] = INIT_VAL;
    }
    return result;
}

function hypermax(gameState: IGameState, depth: number, _alpha: TPlayerScore, aux: IAuxValues): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        return calcHypermaxValue(gameState, aux);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    let alpha = {..._alpha}; // _alpha should be immutable (but JS objects are passed by reference)
    
    let bestScore = hypermax(nextGSs[0], depth - 1, alpha, aux);
    if (alpha[player] < bestScore[player]) {
        alpha[player] = bestScore[player];
    }

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (sumScore(alpha) >= 0) break; // hypermax pruning

        const nextScore = hypermax(nextGSs[i], depth - 1, alpha, aux);

        if (alpha[player] < nextScore[player]) {
            alpha[player] = nextScore[player];
            bestScore = nextScore;
        }
    }

    return bestScore;
}

function calcHypermaxValue(gameState: IGameState, { numOfPlayers, evalPlayers }: IAuxValues): TPlayerScore {
    const absScore = calcAbsoluteScore(gameState);
    const avg = numOfPlayers <= 1 ? 1 : sumScore(absScore) / numOfPlayers;

    let result = {...BASE_SCORE};
    for (const key in evalPlayers) {
        if (evalPlayers[key]) {
            result[key] = absScore[key] / avg;
        }
    }
    return result;
}