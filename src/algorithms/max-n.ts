import { IGameState, isGameOver, getNextGameStates } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore, evalGameState } from '../eval-func';

// -----------------------------------------------------------------------------

export function maxN(gameState: IGameState, depth: number): IGameState {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);

    let bestScore = _maxN(nextGSs[0], depth - 1);
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _maxN(nextGSs[i], depth - 1);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
            bestIndex = i;
        }
    }

    return nextGSs[bestIndex];
}

// -----------------------------------------------------------------------------

function _maxN(gameState: IGameState, depth: number): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalGameState(gameState);
        return counterweightOpponents(score);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = _maxN(nextGSs[0], depth - 1);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _maxN(nextGSs[i], depth - 1);
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