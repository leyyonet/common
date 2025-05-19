import {strict as assert} from 'assert';
import {describe} from "node:test";
import {$assert, leyyo} from "../src";


describe('assertion', () => {
    it('not symbol', () => {
        assert.throws(() => $assert.sym('a', {where: 'test'}));
    });
    it('is symbol', () => {
        assert.doesNotThrow(() => $assert.sym(Symbol.for('a'), {where: 'test'}));
    });
});