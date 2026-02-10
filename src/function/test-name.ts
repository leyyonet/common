import {randomTestNo} from "./random-test-no";
import {FQN} from "../internal";

/**
 * Build test name
 *
 * @param {string} testCase - it would be built via {@link testCase}
 * @param {string} title - test title
 * @return {string}
 * */
export function testName(testCase: string, title: string): string {
    testCase = (typeof testCase === 'string') ? testCase : `${FQN}@${randomTestNo()}`;
    title = (typeof title === 'string') ? title : '???';
    return `[test:${testCase}] >> ${title}`;
}
