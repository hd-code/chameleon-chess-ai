import { IGameState } from 'chameleon-chess-logic';
import { getNextGameStates } from 'chameleon-chess-logic/dist/models/game-state';
import { IAlgorithmReturn } from '../types';

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
) {
    function main(gameState: IGameState, maxDepth: number, maxTime: number): IAlgorithmReturn {
        const nextGSs = getNextGameStates(gameState);
        const numOfMoves = nextGSs.length;
    
        // ------------------------------
        let additional = init(gameState, param);
        // ------------------------------

        const begin = Date.now();
    
        let scores: S[] = [];
        for (let i = 0, ie = nextGSs.length; i < ie; i++) {
            // ------------------------------
            const { score, additional: a } = evalGameState(nextGSs[i], 0, additional);
            scores.push(score);
            additional = a;
            // ------------------------------
        }

        let move = 0;
        let depth = 1;

        while (Date.now() - begin < maxTime && depth < maxDepth) {

            // ------------------------------
            const { score, additional: a } = evalGameState(nextGSs[move], depth, additional);
            scores[move] = score;
            additional = a;
            // ------------------------------
    
            if (++move >= numOfMoves) {
                move = 0;
                depth += 1;
    
                // ------------------------------
                additional = onNextDepth(additional);
                // ------------------------------
            }
        }

        const end = Date.now();
    
        // ------------------------------
        const bestIndex = findBestScoreIndex(scores, additional);
        // ------------------------------
    
        return { gameState: nextGSs[bestIndex], depth: depth + (move / numOfMoves), time: end - begin };
    }

    return main;
}