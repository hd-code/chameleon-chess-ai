/**
 * @file
 * This file contains the data struct and methods for the score.
 */

import { EPlayer } from 'chameleon-chess-logic';

// -----------------------------------------------------------------------------

export type TPlayerScore = {[player in EPlayer]: number}

export function getZeroScore(): TPlayerScore {
    return { 0: 0, 1: 0, 2: 0, 3: 0 };
}

export function sumScore(score: TPlayerScore): number {
    return score[0] + score[1] + score[2] + score[3];
}

/** Do not use this on zero vectors or scores with negative values!  */
export function normalizeScore(score: TPlayerScore): TPlayerScore {
    const sum = sumScore(score);
    return {
        0: score[0] / sum,
        1: score[1] / sum,
        2: score[2] / sum,
        3: score[3] / sum,
    };
}

export function findMaxScoreIndex(scores: TPlayerScore[], player: EPlayer): number {
    let best = scores[0], index = 0;
    for (let i = 1, ie = scores.length; i < ie; i++) {
        const next = scores[i];
        if (best[player] < next[player]) {
            best = next;
            index = i;
        }
    }
    return index;
}

export function findMaxIndex(n: number[]): number {
    let best = n[0],  index = 0;
    for (let i = 1, ie = n.length; i < ie; i++) {
        const next = n[i];
        if (best < next) {
            best = next;
            index = i;
        }
    }
    return index;
}