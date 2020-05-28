import { IGameState, isGameOver, EPlayer } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { TPlayerScore, normalizeScore, findMaxScoreIndex } from './player-score';
import { FEvalFunc, evalGameState as bestEvalFunc } from './eval-func';

// -----------------------------------------------------------------------------
// Interface Implementation
// -----------------------------------------------------------------------------

type S = TPlayerScore;
type A = { player: EPlayer, evalFunc: FEvalFunc };
type P = { evalFunc: FEvalFunc };

export function init(currentGS: IGameState, param?: P): A {
    const evalFunc = param ? param.evalFunc : bestEvalFunc;
    return { player: currentGS.player, evalFunc };
}

export function evalGameState(gameState: IGameState, depth: number, additional: A): { score: S, additional: A } {
    const score = maxN(gameState, depth, additional.evalFunc);
    return { score, additional };
}

export function onNextDepth(additional: A): A {
    return additional;
}

export function findBestScoreIndex(scores: S[], additional: A): number {
    return findMaxScoreIndex(scores, additional.player);
}

// -----------------------------------------------------------------------------
// Algorithm Implementation
// -----------------------------------------------------------------------------

function maxN(gameState: IGameState, depth: number, evalFunc: FEvalFunc): TPlayerScore {
    if (isGameOver(gameState) || depth <= 0) {
        return calcScore(gameState, evalFunc);
    }
    
    const player = gameState.player;
    const nextGSs = getNextGameStates(gameState);
    
    let bestScore = maxN(nextGSs[0], depth - 1, evalFunc);

    for (let i = 1, ie = nextGSs.length; i < ie; i++) {
        const nextScore = maxN(nextGSs[i], depth - 1, evalFunc);
        if (bestScore[player] < nextScore[player]) {
            bestScore = nextScore;
        }
    }

    return bestScore;
}

function calcScore(gameState: IGameState, evalFunc: FEvalFunc) {
    const score = evalFunc(gameState);
    return normalizeScore(score);
}