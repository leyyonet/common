// noinspection JSUnusedGlobalSymbols

import {Fnc, LifecycleSortLambda, LifecycleStage, LifecycleTuple} from "../index.types";
import {FQN} from "../internal";
import {isText} from "../function";
import {DeveloperError} from "../error";
import {newRepoMap} from "./map.fn";

// region properties
const where = `${FQN}.LifecycleFn`;
const stages = newRepoMap<LifecycleStage, Map<string, Array<Fnc>>>(`${where}.stages`);
let lifecycleSortLambda: LifecycleSortLambda;
// endregion properties


/**
 * Init lifecycle by stage
 *
 * @param {LifecycleStage} stage - stage
 * */
const init = (stage: LifecycleStage): void => {
    stages.set(stage, new Map<string, Array<Fnc>>());
}

/**
 * Add lifecycle by stage
 *
 * @param {LifecycleStage} stage - stage
 * @param {string} name - your callback name
 * @param {function} callback - it will be called on {@link runLifecycleStage}
 * */
export function addLifecycle(stage: LifecycleStage, name: string, callback: Fnc) : void {
    if (!isText(stage)) {
        throw new DeveloperError('Invalid lifecycle stage', 'addLifecycle#01', where);
    }
    if (!stages.has(stage)) {
        throw new DeveloperError('Absent lifecycle stage', 'addLifecycle#02', where);
    }
    if (!isText(name)) {
        throw new DeveloperError('Invalid lifecycle name', 'addLifecycle#03', where);
    }
    if (typeof callback !== 'function') {
        throw new DeveloperError('Invalid lifecycle callback', 'addLifecycle#04', where);
    }
    const item = stages.get(stage);
    if (!item.has(name)) {
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
export async function runLifecycleStage (stage: LifecycleStage, ...params: Array<unknown>): Promise<number> {
    if (!isText(stage)) {
        throw new DeveloperError('Invalid lifecycle stage', 'runLifecycleStage#01', where);
    }
    if (!stages.has(stage)) {
        throw new DeveloperError('Absent lifecycle stage', 'runLifecycleStage#02', where);
    }
    let count = 0;
    const item = stages.get(stage);
    if (item.size < 1) {
        return count;
    }
    let sorted: Array<LifecycleTuple>;
    if (lifecycleSortLambda) {
        try {
            sorted = lifecycleSortLambda(stages.get(stage));
        }
        catch (e) {
            new DeveloperError(`Raised sort-lambda run [${stage}]`, 'runLifecycleStage#03', where).log(e);
        }
    }
    if (!sorted) {
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
            }
            catch (e) {
                new DeveloperError(`Raised callback run [${stage}/${name}]`, 'runLifecycleStage#04', where).log(e);
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
export function setLifecycleSort(stage: LifecycleStage, lambda: LifecycleSortLambda): void {
    if (!isText(stage)) {
        throw new DeveloperError('Invalid lifecycle stage', 'setLifecycleSort#01', where);
    }
    if (!stages.has(stage)) {
        throw new DeveloperError('Absent lifecycle stage', 'setLifecycleSort#02', where);
    }
    if (typeof lambda !== 'function') {
        throw new DeveloperError('Invalid lifecycle callback', 'setLifecycleSort#03', where);
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
