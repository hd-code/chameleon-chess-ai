/**
 * @file
 * This file contains the algorithm factory.
 */

import { IGameState } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { FEvalFunc } from '../eval-func';

// -----------------------------------------------------------------------------

/** Signature of an algorithm instance */
export type FAlgorithm = (gameState: IGameState, mode: EMode, modeValue: number) => IAlgorithmReturn

/** Supported operation modes */
export type EMode = 'depth'|'time';

/** The return type of an algorithm instance */
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

/**
 * Creates an algorithm instance. For that to work, an implementation of the
 * interface, an evaluation function and an optional param (when defined in the
 * interface implementation) has to be passed.
 */
export function factory<S,A,P>(
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
        // init additional data for the algorithm
        let additional = init(gameState, param);
        // ------------------------------

        // function that is called, when a new depth is reached
        const startNextDepth = () => {
            move = 0;
            depth += 1;

            // ------------------------------
            // hook for the algorithm implentation to modify the addition data
            additional = onNextDepth(additional);
            // ------------------------------
        }

        const begin = Date.now(); // start tracking calculation time
    
        // evaluate first depth of game tree (in time mode)
        // or evaluate with the custom depth when in depth mode
        for (; move < numOfMoves; move++) {
            // ------------------------------
            const { score, additional: a } = evalGameState(nextGSs[move], depth, evalFunc, additional);
            scores.push(score);
            additional = a;
            // ------------------------------
        }
        startNextDepth();

        // iterative deepening - is only used in time mode
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

        const end = Date.now(); // stop calculation time tracking
    
        // ------------------------------
        // use custom function the find the best score and thus the best move
        const bestIndex = findBestScoreIndex(scores, additional);
        // ------------------------------
    
        return { gameState: nextGSs[bestIndex], depth: depth + (move / numOfMoves), time: end - begin };
    }
}

// -----------------------------------------------------------------------------

const MAX_DEPTH = 100;