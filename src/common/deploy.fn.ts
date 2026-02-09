import {Fnc} from "../index.types";
import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {newRepoMap} from "./map.fn";

// region properties
const where = `${FQN}.DeployFn`;
const waitingCallbacks = newRepoMap<string, Array<Fnc>>(`${where}.waitingCallbacks`);
const alreadyDeployed = newRepoMap<string, Array<unknown>>(`${where}.alreadyDeployed`);
// endregion properties

// noinspection JSUnusedGlobalSymbols
/**
 * Wait deploy of a component
 *
 * @param {string} name - name of component
 * @param {function} callback - callback for creator of component, if it completes it, this callback will be called
 * */
export function waitDeploy(name: string, callback: Fnc): void {
    if (!isText(name)) {
        throw new DeveloperError('Invalid event name', 'onDeployed#01', where);
    }
    if (typeof callback !== 'function') {
        throw new DeveloperError('Invalid event callback', 'onDeployed#02', where);
    }
    if (alreadyDeployed.has(name)) {
        try {
            callback(...alreadyDeployed.get(name));
        } catch (e) {
            new DeveloperError('Raised callback run', 'onDeployed#03', where).log(e);
        }
        return;
    }

    if (!waitingCallbacks.has(name)) {
        waitingCallbacks.set(name, []);
    }
    waitingCallbacks.get(name).push(callback);
}
// noinspection JSUnusedGlobalSymbols

/**
 * Complete deploy of a component
 * - It should be called by owner of component
 *
 *
 *
 * @param {string} name - name of component
 * @param {...Array} values - They will be sent to callback of waiting component, {@link waitDeploy}
 * */
export function completeDeploy(name: string, ...values: Array<unknown>): void {
    if (!isText(name)) {
        throw new DeveloperError('Invalid event name', 'onDeployed#04', where);
    }
    const isNew = !alreadyDeployed.has(name);
    alreadyDeployed.set(name, values);

    if (isNew) {
        if (waitingCallbacks.has(name)) {
            const callbacks = waitingCallbacks.get(name);
            waitingCallbacks.delete(name);
            callbacks.forEach(callback => {
                try {
                    callback(...values);
                } catch (e) {
                    new DeveloperError('Raised callback run', 'onDeployed#05', where).log(e);
                }
            });
        }
    }
}
