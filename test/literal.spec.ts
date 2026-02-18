import {strict as assert} from 'assert';
import {literalPool} from "../src/index.js";


const Color = ['blue', 'green', 'red', 'yellow'] as ReadonlyArray<string>;
const Status = ['married', 'single', 'divorced', 'other'] as ReadonlyArray<string>;

describe('literal', () => {
    it('register', () => {
        assert.doesNotThrow(() => literalPool.register({target: Color, name: 'Color', aliases: ['Renk'], fqn: 'com.lemon'}));
    });
    it('has - basic name', () => {
        assert.equal(literalPool.has('Color'), true);
    });
    it('has - full name', () => {
        assert.equal(literalPool.has('com.lemon.Color'), true);
    });
    it('has - alias', () => {
        assert.equal(literalPool.has('Renk'), true);
    });
});
