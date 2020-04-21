import { IGameState, getMoves } from 'chameleon-chess-logic';
import randomGames from '../../data/random-games.json';
import * as fs from 'fs';

// -----------------------------------------------------------------------------

const dirname = __dirname + '/' + '../../data/';
const filename = 'random-games-by-moves.json';

let orderedGSMs = countMovesOfGSs(flattenJSON());
orderedGSMs.sort(sortIGSM);

fs.writeFile(dirname + filename, JSON.stringify(orderedGSMs), e => e && console.log(e));

// -----------------------------------------------------------------------------

export interface IGSMoves {
    gs: IGameState;
    numOfMoves: number;
}

function flattenJSON(): IGameState[] {
    let result: IGameState[] = [];
    for (const key in randomGames) {
        result = result.concat(randomGames[key]);
    }
    return result;
}

function countMovesOfGSs(gameStates: IGameState[]): IGSMoves[] {
    return gameStates.map(gs => ({gs, numOfMoves: countMoves(gs)}));
}

function countMoves(gameState: IGameState): number {
    let result = 0;
    for (let i = 0, ie = gameState.pawns.length; i < ie; i++) {
        result += getMoves(gameState, i).length;
    }
    return result;
}

function sortIGSM(a: IGSMoves, b: IGSMoves) {
    return a.numOfMoves - b.numOfMoves;
}