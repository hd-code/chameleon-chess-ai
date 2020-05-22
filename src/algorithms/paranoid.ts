import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore, findMaxIndex } from './helper/player-score';
import { evalGameState } from './helper/eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = number;
type A = { player: EPlayer, alpha: number };

export function initScores(currentGS: IGameState, nextGSs: IGameState[]): { scores: S[], additional: A } {
    const additional = { player: currentGS.player, alpha: -INF };

    let scores: S[] = [];
    for (let i = 0, ie = nextGSs.length; i < ie; i++) {
        scores[i] = _paranoid(nextGSs[i], 0, additional.player);
    }

    return { scores, additional };
}

export function calcNextScore(gameState: IGameState, depth: number, additional: A): { score: S, additional: A } {
    const score = _paranoid(gameState, depth, additional.player, additional.alpha);
    if (additional.alpha < score) {
        additional.alpha = score;
    }
    return { score, additional };
}

export function nextDepth(additional: A): A {
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

function _paranoid(gameState: IGameState, depth: number, maxPlayer: EPlayer, alpha = -INF, beta = INF): number {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalGameState(gameState);
        return calcParanoidScore(score, maxPlayer);
    }
    
    const isMax = gameState.player === maxPlayer;
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = _paranoid(nextGSs[0], depth - 1, maxPlayer, alpha, beta);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (alpha >= beta) break; // alpha-beta pruning

        const nextScore = _paranoid(nextGSs[i], depth - 1, maxPlayer, alpha, beta);

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