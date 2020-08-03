import { IGameState, isGameOver, EPlayer } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { TPlayerScore, getZeroScore, sumScore, findMaxScoreIndex, normalizeScore } from '../player-score';
import { FEvalFunc } from '../eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = TPlayerScore;
type A = { player: EPlayer, players: EPlayer[], alpha: TPlayerScore, normalize: boolean };
type P = boolean; // normalize score ?

export function init(currentGS: IGameState, param?: P): A {
    const players = getPlayers(currentGS);
    const alpha = getInitAlpha(players);
    return { player: currentGS.player, players, alpha, normalize: param||false };
}

export function evalGameState(gameState: IGameState, depth: number, evalFunc: FEvalFunc, additional: A): { score: S, additional: A } {
    const score = hypermax(gameState, depth, evalFunc, additional.normalize, additional.alpha, additional.players);

    if (additional.alpha[additional.player] < score[additional.player]) {
        additional.alpha[additional.player] = score[additional.player];
    }

    return { score, additional };
}

export function onNextDepth(additional: A): A {
    additional.alpha = getInitAlpha(additional.players);
    return additional;
}

export function findBestScoreIndex(scores: S[], additional: A): number {
    return findMaxScoreIndex(scores, additional.player);
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
// -----------------------------------------------------------------------------

const MAX_SUM = 0;
const INF = 999999;

function hypermax(gameState: IGameState, depth: number, evalFunc: FEvalFunc, normalize: boolean, _alpha: TPlayerScore, players: EPlayer[]): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        let score = evalFunc(gameState);
        if (normalize) score = normalizeScore(score);
        return calcHypermaxScore(score, players);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    let alpha = {..._alpha}; // _alpha should be immutable (but JS objects are passed by reference)
    
    let bestScore = hypermax(nextGSs[0], depth - 1, evalFunc, normalize, alpha, players);
    if (alpha[player] < bestScore[player]) {
        alpha[player] = bestScore[player];
    }

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (sumScore(alpha) >= MAX_SUM) break; // hypermax pruning

        const nextScore = hypermax(nextGSs[i], depth - 1, evalFunc, normalize, alpha, players);

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

function getPlayers(gameState: IGameState): EPlayer[] {
    let result = {};
    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        const pawn = gameState.pawns[i];
        result[pawn.player] = true;
    }
    return Object.keys(result).map(player => parseInt(player));
}

function getInitAlpha(players: EPlayer[]): TPlayerScore {
    let result = getZeroScore();
    for (let i = 0, ie = players.length; i < ie; i++) {
        const player = players[i];
        result[player] = -INF;
    }
    return result;
}