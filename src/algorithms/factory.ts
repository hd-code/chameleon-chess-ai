import { IGameState } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { FAlgorithm, IAlgorithmReturn, EMode } from '../types';

// -----------------------------------------------------------------------------

/**
 * Algorithms have to implement this interface. Then the `factory()` function can
 * be used to create an algorithm instance, which is used in the testing scripts.
 * 
 * S..score, A..additional, P..parameter
 */
export interface IAlgorithmFactory <S,A,P>{
    init: (currentGS: IGameState, param?: P) => A;
    evalGameState: (gameState: IGameState, depth: number, additional: A) => { score: S, additional: A };
    onNextDepth: (additional: A) => A;
    findBestScoreIndex: (scores: S[], additional: A) => number;
}

export function factory<S,A,P>(
    { init, evalGameState, onNextDepth, findBestScoreIndex }: IAlgorithmFactory<S,A,P>,
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
            const { score, additional: a } = evalGameState(nextGSs[move], depth, additional);
            scores.push(score);
            additional = a;
            // ------------------------------
        }
        startNextDepth();

        if (mode === 'time') {
            while (Date.now() - begin < modeValue && depth < MAX_DEPTH) {

                // ------------------------------
                const { score, additional: a } = evalGameState(nextGSs[move], depth, additional);
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