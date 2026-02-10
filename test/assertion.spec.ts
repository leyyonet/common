import {strict as assert} from 'assert';
import {CausedError} from "../src";


describe('error', () => {
    it('not symbol', () => {
        assert.throws(() => {
            throw new CausedError('invalid')
        });
    });
});
