import assert from 'assert';
import * as Arrays from '../../src/helper/array';

// -----------------------------------------------------------------------------

describe('helper/array', () => {
    describe('getPermutations()', () => {
        it('should return all 2 permutations for [1,2]', () => {
            const data = [1,2];

            const expected = [
                [1,2],
                [2,1],
            ];
            const actual = Arrays.getPermutations(data);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return all 6 permutations for [1,2,3]', () => {
            const data = [1,2,3];

            const expected = [
                [1,2,3],
                [1,3,2],
                [2,1,3],
                [2,3,1],
                [3,1,2],
                [3,2,1],
            ];
            const actual = Arrays.getPermutations(data);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return all 6 permutations for [1,1,3] without removing duplicates', () => {
            const data = [1,1,3];

            const expected = [
                [1,1,3],
                [1,3,1],
                [1,1,3],
                [1,3,1],
                [3,1,1],
                [3,1,1],
            ];
            const actual = Arrays.getPermutations(data);

            assert.deepStrictEqual(actual, expected);
        });

        it('should return all 3 permutations for [1,1,3] when duplicates are removed', () => {
            const data = [1,1,3];

            const expected = [
                [1,1,3],
                [1,3,1],
                [3,1,1],
            ];
            const actual = Arrays.getPermutations(data, true);

            assert.deepStrictEqual(actual, expected);
        });
    });
});