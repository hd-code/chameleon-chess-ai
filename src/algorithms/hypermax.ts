import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { TPlayerScore, getZeroScore, sumScore, evalGameState } from '../eval-func';

// -----------------------------------------------------------------------------

export function hypermax(gameState: IGameState, depth: number): IGameState {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);

    const players = getPlayers(gameState);
    let alpha = getInitAlpha(players);

    alpha[player] = _hypermax(nextGSs[0], depth - 1, alpha, players)[player];
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _hypermax(nextGSs[i], depth - 1, alpha, players);
        if (alpha[player] < nextScore[player]) {
            alpha[player] = nextScore[player];
            bestIndex = i;
        }
    }

    return nextGSs[bestIndex];
}

// -----------------------------------------------------------------------------

const MAX_SUM = 0;

function _hypermax(gameState: IGameState, depth: number, _alpha: TPlayerScore, players: EPlayer[]): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalGameState(gameState);
        return calcHypermaxScore(score, players);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    let alpha = {..._alpha}; // _alpha should be immutable (but JS objects are passed by reference)
    
    let bestScore = _hypermax(nextGSs[0], depth - 1, alpha, players);
    if (alpha[player] < bestScore[player]) {
        alpha[player] = bestScore[player];
    }

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (sumScore(alpha) >= MAX_SUM) break; // hypermax pruning

        const nextScore = _hypermax(nextGSs[i], depth - 1, alpha, players);

        if (alpha[player] < nextScore[player]) {
            alpha[player] = nextScore[player];
            bestScore = nextScore;
        }
    }

    return bestScore;
}

function calcHypermaxScore(score: TPlayerScore, players: EPlayer[]): TPlayerScore {
    const avg = sumScore(score) / players.length;
    let result = getZeroScore();

    for (let i = 0, ie = players.length; i < ie; i++) {
        const player = players[i];
        result[player] = score[player] - avg;
    }

    return result;
}

// -----------------------------------------------------------------------------

function getPlayers(gameState: IGameState): EPlayer[] {
    let result = {};
    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] = true;
    }
    return Object.keys(result).map(player => parseInt(player));
}

const INF = 999999;

function getInitAlpha(players: EPlayer[]): TPlayerScore {
    let result = getZeroScore();
    for (let i = 0, ie = players.length; i < ie; i++) {
        const player = players[i];
        result[player] = -INF;
    }
    return result;
}