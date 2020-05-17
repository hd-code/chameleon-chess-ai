import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore, evalGameState } from '../eval-func';

// -----------------------------------------------------------------------------

export function paranoid(gameState: IGameState, depth: number): IGameState {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);

    let bestScore = _paranoid(nextGSs[0], depth - 1, player);
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _paranoid(nextGSs[i], depth - 1, player, bestScore);
        if (bestScore < nextScore) {
            bestScore = nextScore;
            bestIndex = i;
        }
    }

    return nextGSs[bestIndex];
}

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