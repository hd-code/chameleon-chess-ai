import { IGameState, getMoves } from 'chameleon-chess-logic';
import randomGames from '../data/random-games.json';
import { makeMoveMaxN } from '../src/max-n-orig';

// -----------------------------------------------------------------------------

let gameStates: IGameState[] = [];
for (const key in randomGames) {
    gameStates = gameStates.concat(randomGames[key]);
}

const MAX_DURATION = 1000;

let anyCalcTooLong = false;
for (let i = 0, ie = gameStates.length; i < ie; i++) {
    const depth = calcDepth(gameStates[i]);
    
    const begin = Date.now();
    makeMoveMaxN(gameStates[i], depth);
    const end = Date.now();
    
    const duration = end - begin;
    if (duration > MAX_DURATION) {
        anyCalcTooLong = true;
        const numOfMoves = countMoves(gameStates[i]);
        console.log('b:', numOfMoves, ' d:', depth, ' duration:', duration, 'ms');
    }
}

console.log(
    anyCalcTooLong ? 'Some calculations took too long. See above' :
    'All calculations were in time – Nice :-D'
);

// -----------------------------------------------------------------------------

function countMoves(gameState: IGameState): number {
    let result = 0;
    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        result += getMoves(gameState, i).length;
    }
    return result;
}

// according to table in: data/max-n-depth.csv
function calcDepth(gameState: IGameState): number {
    const numOfMoves = countMoves(gameState);

    // if (numOfMoves <  4) return 30; // is not important
    if (numOfMoves <  8) return 13;
    if (numOfMoves < 10) return 12;
    if (numOfMoves < 11) return 11;
    if (numOfMoves < 15) return  6;
    if (numOfMoves < 24) return  5;
    if (numOfMoves < 39) return  4;
    if (numOfMoves < 93) return  3;

    return 2;
}