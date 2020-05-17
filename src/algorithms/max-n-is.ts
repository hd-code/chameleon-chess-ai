import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore, evalGameState } from '../eval-func';

// -----------------------------------------------------------------------------

export function maxNIS(gameState: IGameState, depth: number): IGameState {
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);

    let bestScore = _maxNIS(nextGSs[0], depth - 1);
    let bestIndex = 0;

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = _maxNIS(nextGSs[i], depth - 1, bestScore[player]);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
            bestIndex = i;
        }
    }

    return nextGSs[bestIndex];
}

// -----------------------------------------------------------------------------

const MAX_SCORE = 1;

function _maxNIS(gameState: IGameState, depth: number, parentsBestScore = 0): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        const score = evalGameState(gameState);
        return normalizeScore(score);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    const maxScore = MAX_SCORE - parentsBestScore; // immediate & shallow pruning
    
    let bestScore = _maxNIS(nextGSs[0], depth - 1);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        if (bestScore[player] >= maxScore) break; // immediate & shallow pruning

        const nextScore = _maxNIS(nextGSs[i], depth - 1);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}

function normalizeScore(score: TPlayerScore): TPlayerScore {
    const sum = sumScore(score);
    return {
        [EPlayer.RED]: score[EPlayer.RED] / sum,
        [EPlayer.GREEN]: score[EPlayer.GREEN] / sum,
        [EPlayer.YELLOW]: score[EPlayer.YELLOW] / sum,
        [EPlayer.BLUE]: score[EPlayer.BLUE] / sum,
    }; 
}