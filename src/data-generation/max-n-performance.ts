import { IGameState } from 'chameleon-chess-logic';
import randomGames from '../../data/random-games.json';
import { makeMoveMaxN } from '../max-n';
import { toCSV } from '../helper/csv';
import * as fs from 'fs';

// -----------------------------------------------------------------------------

const dirname = __dirname + '/' + '../../data/';
const filename = 'random-games-performance.csv';

const allGS = flattenJSON();
const result = measureGame(allGS, 1, 4);

const csv = toCSV(result);
fs.writeFile(dirname + filename, csv, e => e && console.log(e));

// -----------------------------------------------------------------------------

function flattenJSON(): IGameState[] {
    let result: IGameState[] = [];
    for (const key in randomGames) {
        result = result.concat(randomGames[key]);
    }
    return result;
}

function measureGame(game: IGameState[], from: number, to: number) {
    return game.map(gs => measureTurnDepth(gs, from, to));
}

function measureTurnDepth(gameState: IGameState, from: number, to: number) {
    let result: any = {};
    for (let i = from, ie = to; i <= ie; i++) {
        result['depth'+i] = measureTurn(gameState, i);
    }
    return result;
}

function measureTurn(gameState: IGameState, depth: number): number {
    const begin = Date.now();
    makeMoveMaxN(gameState, depth);
    const end = Date.now();
    return end - begin;
}