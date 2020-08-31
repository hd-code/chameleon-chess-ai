/**
 * @file
 * This file contains structs and methods to play a session.
 */

import { EMode } from './algorithm/factory';
import { IGame, MNameAlgorithm, MPlayerAlgorithm, getMoveStatsOfAlgorithm, playGame, getAlgorithmsResult } from './game';
import { flattenArray, getPermutations } from '../lib/obray';
import { Vector, round } from '../lib/math';

// -----------------------------------------------------------------------------

/** Contains all data of a session */
export interface ISession {
    algorithms: string[];
    mode: EMode;
    modeValue: number;
    games: IGame[];
}

/** Plays a session with the given algorithms, mode and mode value. */
export function playSession(algorithms: MNameAlgorithm, mode: EMode, modeValue: number): ISession {
    const algos = Object.keys(algorithms);
    const maps = getPlayerAlgoMaps(algos);
    const games = maps.map(map => playGame(algorithms, map, mode, modeValue));
    return { algorithms: algos, mode, modeValue, games };
}

// -----------------------------------------------------------------------------

/** The results (stats) of a played session */
export interface ISessionResult {
    mode: EMode;
    modeValue: number;
    numOfGames: number;
    algorithms: IAlgorithmResult[];
}

/** The results of a particular algorithm from a session. */
export interface IAlgorithmResult {
    algorithm: string;
    wins: number;
    draws: number;
    losses: number;
    depthAvg: number;
    depthMedian: number;
    timeAvg: number;
    timeMedian: number;
}

/** Calculates and returns the stats of a session. */
export function evalSession(session: ISession): ISessionResult {
    return {
        mode: session.mode,
        modeValue: session.modeValue,
        numOfGames: session.games.length,
        algorithms: session.algorithms.map(algorithm => getAlgorithmResult(algorithm, session)),
    };
}

// -----------------------------------------------------------------------------

function getPlayerAlgoMaps(algorithms: string[]): MPlayerAlgorithm[] {
    const matches = getMatchings(algorithms);
    const cleanedMatches = removeMatchingsWithoutRed(matches);
    return cleanedMatches.map(match => makePlayerMap(match));
}

type a = string|null

type TMatch = [a,a,a,a]

function getMatchings(algorithms: string[]): TMatch[] {
    const [a,b,c,d] = algorithms;
    const _ = null;
    let result: TMatch[] = [];
    switch (algorithms.length) {
        case 1:
            result = result.concat(getPermutations([a,a,_,_], true) as TMatch[]);
            result = result.concat(getPermutations([a,a,a,_], true) as TMatch[]);
            result = result.concat(getPermutations([a,a,a,a], true) as TMatch[]);
            return removeMatchingsWithoutRed(result);

        case 2:
            result = result.concat(getPermutations([a,b,_,_], true) as TMatch[]);
            result = result.concat(getPermutations([a,a,b,_], true) as TMatch[]);
            result = result.concat(getPermutations([a,b,b,_], true) as TMatch[]);
            result = result.concat(getPermutations([a,a,a,b], true) as TMatch[]);
            result = result.concat(getPermutations([a,a,b,b], true) as TMatch[]);
            result = result.concat(getPermutations([a,b,b,b], true) as TMatch[]);
            return removeMatchingsWithoutRed(result);

        case 3:
            result = result.concat(getPermutations([a,b,c,_], true) as TMatch[]);
            result = result.concat(getPermutations([a,b,c,a], true) as TMatch[]);
            result = result.concat(getPermutations([a,b,c,b], true) as TMatch[]);
            result = result.concat(getPermutations([a,b,c,c], true) as TMatch[]);
            return removeMatchingsWithoutRed(result);
            
        case 4:
            result = result.concat(getPermutations([a,b,c,d], true) as TMatch[]);
            return removeMatchingsWithoutRed(result);

        default: return [];
    }
}

function removeMatchingsWithoutRed(matchings: TMatch[]): TMatch[] {
    return matchings.filter(match => match[0] !== null);
}

function makePlayerMap(match: TMatch): MPlayerAlgorithm {
    return { 0: match[0], 1: match[1], 2: match[2], 3: match[3] };
}

// -----------------------------------------------------------------------------

function getAlgorithmResult(algorithm: string, session: ISession): IAlgorithmResult {
    const results = session.games.map(game => getAlgorithmsResult(algorithm, game));
    const wins = results.filter(result => result === 'win').length;
    const draws = results.filter(result => result === 'draw').length;
    const losses = results.filter(result => result === 'loss').length;

    const tmpStats = session.games.map(game => {
        return getMoveStatsOfAlgorithm(algorithm, game);
    });
    const stats = flattenArray(tmpStats);
    const depth = stats.map(stats => stats.depth);
    const time  = stats.map(stats => stats.time);

    return {
        algorithm, wins, draws, losses,
        depthAvg: round(Vector.avg(depth), 2), depthMedian: round(Vector.median(depth), 2),
        timeAvg:  round(Vector.avg(time)),     timeMedian:  round(Vector.median(time)),
    }
}