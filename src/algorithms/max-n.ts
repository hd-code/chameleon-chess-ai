import { IGameState, isGameOver, getNextGameStates, EPlayer } from 'chameleon-chess-logic';
import { TPlayerScore, sumScore } from './helper/player-score';
import { evalGameState } from './helper/eval-func';

// -----------------------------------------------------------------------------
// Wrapper Methods
// -----------------------------------------------------------------------------

type S = TPlayerScore;
type A = { player: EPlayer };

export function initScores(currentGS: IGameState, nextGSs: IGameState[]): { scores: S[], additional: A } {
    const additional = { player: currentGS.player };

    let scores: S[] = [];
    for (let i = 0, ie = nextGSs.length; i < ie; i++) {
        scores[i] = _maxN(nextGSs[i], 0);
    }

    return { scores, additional };
}

export function calcNextScore(gameState: IGameState, depth: number, additional: A): { score: S, additional: A } {
    const score = _maxN(gameState, depth);
    return { score, additional };
}

export function nextDepth(additional: A): A {
    return additional;
}

export function findBestScoreIndex(scores: S[], additional: A): number {
    const player = additional.player;
    let best = scores[0], index = 0;
    for (let i = 1, ie = scores.length; i < ie; i++) {
        if (best[player] < scores[i][player]) {
            best = scores[i];
            index = i;
        }
    }
    return index;
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
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