import { IGameState } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { FEvalFunc } from '../eval-func';

// -----------------------------------------------------------------------------

export type EMode = 'depth'|'time';

export type FAlgorithm = (gameState: IGameState, mode: EMode, modeValue: number) => IAlgorithmReturn

export interface IAlgorithmReturn {
    gameState: IGameState;
    depth: number;
    time: number;
}

/**
 * Algorithms have to implement this interface. Then the `makeAlgorithm()` function can
 * be used to create an algorithm instance, which is used in the testing scripts.
 * 
 * S..score, A..additional, P..parameter
 */
export interface IAlgorithmFactory <S,A,P>{
    init: (currentGS: IGameState, param?: P) => A;
    evalGameState: (gameState: IGameState, depth: number, evalFunc: FEvalFunc, additional: A) => { score: S, additional: A };
    onNextDepth: (additional: A) => A;
    findBestScoreIndex: (scores: S[], additional: A) => number;
}

export function makeAlgorithm<S,A,P>(
    { init, evalGameState, onNextDepth, findBestScoreIndex }: IAlgorithmFactory<S,A,P>,
    evalFunc: FEvalFunc,
    param?: P
): FAlgorithm {
    return function (gameState: IGameState, mode: EMode, modeValue: number): IAlgorithmReturn {
        const nextGSs = getNextGameStates(gameState);
        const numOfMoves = nextGSs.length;

        let move = 0;
        let depth = mode === 'depth' ? modeValue - 1 : 0;

        let scores: S[] = [];
        // ------------------------------
        let additional = init(gameState, param);
        // ------------------------------

        const startNextDepth = () => {
            move = 0;
            depth += 1;

            // ------------------------------
            additional = onNextDepth(additional);
            // ------------------------------
        }

        const begin = Date.now();
    
        for (; move < numOfMoves; move++) {
            // ------------------------------
            const { score, additional: a } = evalGameState(nextGSs[move], depth, evalFunc, additional);
            scores.push(score);
            additional = a;
            // ------------------------------
        }
        startNextDepth();

        if (mode === 'time') {
            while (Date.now() - begin < modeValue && depth < MAX_DEPTH) {

                // ------------------------------
                const { score, additional: a } = evalGameState(nextGSs[move], depth, evalFunc, additional);
                scores[move] = score;
                additional = a;
                // ------------------------------
        
                if (++move >= numOfMoves) startNextDepth();
            }
        }

        const end = Date.now();
    
        // ------------------------------
        const bestIndex = findBestScoreIndex(scores, additional);
        // ------------------------------
    
        return { gameState: nextGSs[bestIndex], depth: depth + (move / numOfMoves), time: end - begin };
    }
}

// -----------------------------------------------------------------------------

const MAX_DEPTH = 100;