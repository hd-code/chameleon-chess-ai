import { IGameState, isGameOver, EPlayer } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { TPlayerScore, sumScore, findMaxIndex, normalizeScore } from './player-score';
import { evalGameState as evalFunc } from './eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = number;
type A = { player: EPlayer, alpha: number, normalize: boolean };
type P = boolean; // normalize score ?

export function init(currentGS: IGameState, param?: P): A {
    return { player: currentGS.player, alpha: -INF, normalize: param||false };
}

export function evalGameState(gameState: IGameState, depth: number, additional: A): { score: S, additional: A } {
    const score = paranoid(gameState, depth, additional.player, additional.normalize, additional.alpha);
    if (additional.alpha < score) {
        additional.alpha = score;
    }
    return { score, additional };
}

export function onNextDepth(additional: A): A {
    additional.alpha = -INF;
    return additional;
}

export function findBestScoreIndex(scores: S[], additional: A): number {
    return findMaxIndex(scores);
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
// -----------------------------------------------------------------------------

const INF = 999999;

function paranoid(gameState: IGameState, depth: number, maxPlayer: EPlayer, normalize: boolean, alpha = -INF, beta = INF): number {
    if (isGameOver(gameState) || depth <= 0) {
        let score = evalFunc(gameState);
        if (normalize) score = normalizeScore(score);
        return calcParanoidScore(score, maxPlayer);
    }
    
    const isMax = gameState.player === maxPlayer;
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = paranoid(nextGSs[0], depth - 1, maxPlayer, normalize, alpha, beta);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (alpha >= beta) break; // alpha-beta pruning

        const nextScore = paranoid(nextGSs[i], depth - 1, maxPlayer, normalize, alpha, beta);

        if (isMax) {
            if (alpha < nextScore) {
                alpha = nextScore;
                bestScore = nextScore;
            }
        } else {
            if (beta > nextScore) {
                beta = nextScore;
                bestScore = nextScore;
            }
        }
    }

    return bestScore;
}

function calcParanoidScore(score: TPlayerScore, maxPlayer: EPlayer): number {
    return 2 * score[maxPlayer] - sumScore(score);
}