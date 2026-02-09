import {strict as assert} from 'assert';
import {CountryCode, countryHandler} from "../src";


describe('country', () => {
    test('has', () => {
        assert.equal(countryHandler.has('TR'), true);
    });
    test('has not (wrong string)', () => {
        assert.equal(countryHandler.has('TRX' as CountryCode), false);
    });
    test('has not (invalid type)', () => {
        assert.equal(countryHandler.has(3 as unknown as CountryCode), false);
    });
});

// assert.throws(() => countryHandler.has('TR'));
// assert.doesNotThrow(() => $assert.sym(Symbol.for('a'), {where: 'test'}));
