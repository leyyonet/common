// noinspection JSUnusedGlobalSymbols

import {Fnc, LifecycleSortLambda, LifecycleStage, LifecycleTuple} from "../index.types";
import {FQN} from "../internal";
import {isText} from "../function";
import {DeveloperError} from "../error";
import {newRepoMap} from "./map.fn";
import {testCase} from "./test.fn";

// region properties
const where = `${FQN}.LifecycleFn`;
const _stages = newRepoMap<LifecycleStage, Map<string, Array<Fnc>>>(`${where}.stages`);
let lifecycleSortLambda: LifecycleSortLambda;
// endregion properties


/**
 * Init lifecycle by stage
 *
 * @param {LifecycleStage} stage - stage
 * */
const init = (stage: LifecycleStage): void => {
    _stages.set(stage, new Map<string, Array<Fnc>>());
}

/**
 * Add lifecycle by stage
 *
 * @param {LifecycleStage} stage - stage
 * @param {string} name - your callback name
 * @param {function} callback - it will be called on {@link runLifecycleStage}
 * */
export function addLifecycleStage(stage: LifecycleStage, name: string, callback: Fnc): void {
    if ( !isText(stage)) {
        throw new DeveloperError('Invalid lifecycle stage', testCase(FQN, 100), where);
    }
    if ( !_stages.has(stage)) {
        throw new DeveloperError(`Lifecycle stage could not be found [${stage}]`, testCase(FQN, 101), where);
    }
    if ( !isText(name)) {
        throw new DeveloperError(`Invalid lifecycle name [${stage}]`, testCase(FQN, 102), where);
    }
    if (typeof callback !== 'function') {
        throw new DeveloperError(`Invalid lifecycle callback [${stage}/${name}]`, testCase(FQN, 103), where);
    }
    const item = _stages.get(stage);
    if ( !item.has(name)) {
        item.set(name, []);
    }
    item.get(name).push(callback);
}

/**
 * Run lifecycle by stage
 *
 * @param {LifecycleStage} stage
 * @param {...Array} params
 * @return {number} - called callbacks number
 * */
export async function runLifecycleStage(stage: LifecycleStage, ...params: Array<unknown>): Promise<number> {
    if ( !isText(stage)) {
        throw new DeveloperError('Invalid lifecycle stage', testCase(FQN, 104), where);
    }
    if ( !_stages.has(stage)) {
        throw new DeveloperError(`Lifecycle stage could not be found [${stage}]`, testCase(FQN, 105), where);
    }
    let count = 0;
    const item = _stages.get(stage);
    if (item.size < 1) {
        return count;
    }
    let sorted: Array<LifecycleTuple>;
    if (lifecycleSortLambda) {
        try {
            sorted = lifecycleSortLambda(_stages.get(stage));
        } catch (e) {
            new DeveloperError(`Callback error during lifecycle order lambda [${stage}]`, testCase(FQN, 106), where).log(e);
        }
    }
    if ( !sorted) {
        sorted = [];
        for (const [name, callbacks] of item.entries()) {
            sorted.push([name, callbacks]);
        }
    }
    for (const [name, callbacks] of sorted) {
        for (const callback of callbacks) {
            try {
                await callback(...params);
                count++;
            } catch (e) {
                new DeveloperError(`Callback error during lifecycle callback [${stage}/${name}]`, testCase(FQN, 107), where).log(e);
            }
        }
    }
    return count;
}

/**
 * Set lifecycle sort lambda by stage
 *
 * @param {LifecycleStage} stage
 * @param {LifecycleSortLambda} lambda - function that sorts map items
 * */
export function setLifecycleOrderLambda(stage: LifecycleStage, lambda: LifecycleSortLambda): void {
    if ( !isText(stage)) {
        throw new DeveloperError('Invalid lifecycle stage', testCase(FQN, 108), where);
    }
    if ( !_stages.has(stage)) {
        throw new DeveloperError(`Lifecycle stage could not be found [${stage}]`, testCase(FQN, 109), where);
    }
    if (typeof lambda !== 'function') {
        throw new DeveloperError(`Invalid lifecycle callback [${stage}]`, testCase(FQN, 110), where);
    }
    lifecycleSortLambda = lambda;
}

// initialize stages
init('initialize');
init('print');
init('validate');
init('process');
init('clear');
init('ota-before');
init('ota-after');
init('kill');
