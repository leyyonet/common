// noinspection JSUnusedGlobalSymbols

import {FQN} from "../internal";

// region properties
/**
 * Is test?
 * */
let _isTest: boolean;
// endregion properties

/**
 * Initialize test
 * */
export function initTest (): void {
    _isTest = true;
    if (global) {
        if (!global.leyyo_is_testing) {
            global.leyyo_is_testing = true;

            ['log', 'warn', 'info', 'debug', 'trace', 'error', 'native'].forEach(name => {
                global.console[name] = (): void => {
                };
                console[name] = (): void => {
                };
            });

        }
    }
}

/**
 * Is test?
 *
 * @return {boolean}
 * */
export function isTest (): boolean {
    return _isTest;
}

/**
 * Build test name
 *
 * @param {string} testCase - it would be built via {@link testCase}
 * @param {string} title - test title
 * @return {string}
 * */
export function testName (testCase: string, title: string): string {
    testCase = (typeof testCase === 'string') ? testCase : `${FQN}@${randomCaseNo()}`;
    title = (typeof title === 'string') ? title : '???';
    return `[test:${testCase}] >> ${title}`;
}

/**
 * Build test case
 *
 * @param {string} pck - Package or FQN name
 * @param {(string|number)} caseNo
 * @return {string}
 * */
export function testCase(pck: string, caseNo: string|number): string {
    pck = (typeof pck === 'string') ? pck : FQN;
    let caseStr: string;
    if (typeof caseNo === 'string') {
        caseStr = caseNo;
    }
    else if (typeof caseNo === 'number') {
        caseStr = caseNo.toString(10);
    }
    else {
        caseStr = randomCaseNo();
    }
    return `${pck}#${caseStr}`;
}

/**
 * Generate random test no
 * 
 * @return {string}
 * */
function randomCaseNo (): string {
    return (Math.floor(Math.random() * 999) + 100).toString(10);
}
