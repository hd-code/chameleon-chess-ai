import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { sumScore, calcAbsoluteScore } from './player-score';

// -----------------------------------------------------------------------------

export function evalParanoid(gameState: IGameState, depth: number): number {
    return paranoid(gameState, depth, gameState.player);
}

// -----------------------------------------------------------------------------

/** _Important_: **Do not set alpha and beta**, they are used for the recursion internally! */
function paranoid(gameState: IGameState, depth: number, maxPlayer: EPlayer, alpha = -9999, beta = 9999):  number {
    if (isGameOver(gameState) || depth <= 0) {
        return calcParanoidValue(gameState, maxPlayer);
    }
    
    const isMax = gameState.player === maxPlayer;
    const nextGSs = getNextGameStates(gameState);

    let bestScore = paranoid(nextGSs[0], depth - 1, maxPlayer, alpha, beta);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (alpha >= beta) break; // alpha-beta pruning

        const nextScore = paranoid(nextGSs[i], depth - 1, maxPlayer, alpha, beta);

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

// result = score[maxPlayer] - sum(score[opponents])
// result = score[maxPlayer] - ( sum(score[all]) - score[maxPlayer] )
// result = 2 * score[maxPlayer] - sum(score[all])
function calcParanoidValue(gameState: IGameState, maxPlayer: EPlayer): number {
    const score = calcAbsoluteScore(gameState);
    return 2 * score[maxPlayer] - sumScore(score);
}