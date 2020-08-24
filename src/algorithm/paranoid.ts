import { IGameState, isGameOver, EPlayer } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { TPlayerScore, sumScore, findMaxIndex, normalizeScore } from '../player-score';
import { FEvalFunc } from '../eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = number;
type A = { player: EPlayer, alpha: number, normalize: boolean };
type P = boolean; // normalize score ?

export function init(currentGS: IGameState, param?: P): A {
    return { player: currentGS.player, alpha: -INF, normalize: param||false };
}

export function evalGameState(gameState: IGameState, depth: number, evalFunc: FEvalFunc, additional: A): { score: S, additional: A } {
    const score = paranoid(gameState, depth, additional.player, evalFunc, additional.normalize, additional.alpha);
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

function paranoid(gameState: IGameState, depth: number, maxPlayer: EPlayer, evalFunc: FEvalFunc, normalize: boolean, alpha = -INF, beta = INF): number {
    // stop recursion when game over or desired depth is reached
    if (isGameOver(gameState) || depth <= 0) {
        let score = evalFunc(gameState);
        if (normalize) score = normalizeScore(score); // normalize score if needed
        return calcParanoidScore(score, maxPlayer);
    }
    
    const isMax = gameState.player === maxPlayer; // find of player is max or min
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = paranoid(nextGSs[0], depth - 1, maxPlayer, evalFunc, normalize, alpha, beta);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (alpha >= beta) break; // alpha-beta pruning

        // do the recursion
        const nextScore = paranoid(nextGSs[i], depth - 1, maxPlayer, evalFunc, normalize, alpha, beta);

        if (isMax) {
            if (alpha < nextScore) { // update alpha if max and score is better
                alpha = nextScore;
                bestScore = nextScore;
            }
        } else {
            if (beta > nextScore) { // update alpha if min and score is better
                beta = nextScore;
                bestScore = nextScore;
            }
        }
    }

    return bestScore;
}

//       scorePlayerMax - sum(scoresPlayersMin)
// =     scorePlayerMax - sum(scoresAllPlayers) + scorePlayerMax
// = 2 * scorePlayerMax - sum(scoresAllPlayers)
function calcParanoidScore(score: TPlayerScore, maxPlayer: EPlayer): number {
    return 2 * score[maxPlayer] - sumScore(score);
}