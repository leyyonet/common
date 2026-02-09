import EventEmitter from "node:events";
import {EventType, Fnc} from "../index.types";
import {isText} from "../function";
import {DeveloperError} from "../error";
import {FQN} from "../internal";
import {defLogger} from "../class";
import {newRepoSet} from "./set.fn";
import {newRepoMap} from "./map.fn";

// region properties
const where = `${FQN}.EventFn`;
const emitter = new EventEmitter();
const listenedEvents = newRepoMap<string, Fnc>(`${where}.listened`);
const waitingEvents = newRepoMap<string, Array<Array<unknown>>>(`${where}.waiting`);
const removedEvents = newRepoMap<string, [number, number]>(`${where}.removed`); // stored, emitted
const deactivatedEvents = newRepoSet<string>(`${where}.deactivated`);
// endregion properties

/**
 * Emit (fire) an event
 *
 * @param {string} name - event name
 * @param {...Array} values - They will be used for callback of listener
 * @return {boolean} - message is emitted correctly
 *
 * Note:
 * - If there is not any listener for this event yet, events will be collected
 * */
export function emitEvent<T extends string = string>(name: EventType|T, ...values: Array<unknown>): boolean {
    if (typeof name !== 'string') {
        return false;
    }
    if (!emitter.emit(name, ...values)) {

        // It is deactivated, no collect it anymore
        if (deactivatedEvents.has(name)) {
            return true;
        }

        let item = waitingEvents.get(name) as Array<Array<unknown>>;
        if (!item) {
            item = [];
            waitingEvents.set(name, item);
        }
        else if (item.length > 10_000) {
            let parts = removedEvents.get(name);
            if (parts === undefined) {
                parts = [item.length, item.length + 1];

                defLogger.warn(`Removed message. name: ${name}, times: ${parts[1]}`, {where, eventName: name});
                item.shift();
                removedEvents.set(name, parts);
            }
            else if (parts[0] >= 10_000 ) {
                // there are too many events, and there is no any listener, close it
                if (parts[1] > 50_000) {
                    deactivateEvent(name);
                    return false;
                }

                // clear half of it
                parts[0] = 5_000;
                item.splice(0, 5_000);

                parts[1]++; // increment emitted
                defLogger.warn(`Removed all messages. name: ${name}, times: ${parts[1]}`, {where, eventName: name});
            }
            else {
                parts[1]++; // increment emitted
                item.shift();
            }
        }
        item.push(values);
        return true;
    }
    return true;
}

/**
 * Listen an event
 *
 * @param {string} name - event name
 * @param {function} callback - callback for emitted event
 *
 * Note:
 * - If there are previous emitted events, it will listen them immediately (lazy event driven)
 * */
export function listenEvent<T extends string = string>(name: EventType|T, callback: Fnc): void {
    if (!isText(name)) {
        throw new DeveloperError('Invalid event name', 'listenEvent#01', where);
    }
    if (typeof callback !== 'function') {
        throw new DeveloperError('Invalid event callback', 'listenEvent#02', where);
    }

    const exists = listenedEvents.has(name);
    if (exists) {
        emitter.removeAllListeners(name);
    }
    emitter.on(name, callback);

    // if there is a listener, event will be activated automatically

    activateEvent(name);
    listenedEvents.set(name, callback);
    if (!exists) {
        if (waitingEvents.has(name)) {
            waitingEvents.get(name).forEach(values => {
                emitter.emit(name, ...values);
            });
            waitingEvents.delete(name);
        }
    }
}

/**
 * Deactivate an event
 *
 * Means:
 * - If there is no any listener then;
 * - - emitted messages will be ignored
 * - - collected message will be cleared
 *
 * @param {string} name - event name
 * @return {boolean} - if it is previously activated (default) then true
 * */
export function deactivateEvent(name: string): boolean {
    if (!isText(name)) {
        throw new DeveloperError('Invalid event name', 'listenEvent#01', where);
    }
    if (waitingEvents.has(name)) {
        defLogger.warn(`Deactivated and cleared all messages. name: ${name}`, {where, eventName: name});
        waitingEvents.delete(name);
    }
    if (removedEvents.has(name)) {
        removedEvents.delete(name);
    }
    if (!deactivatedEvents.has(name)) {
        return false;
    }
    deactivatedEvents.add(name);
    return true;
}

/**
 * Activate an event
 *
 * Means:
 * - If there is no any listener then;
 * - - emitted messages will be collected till listener comes in
 *
 * @param {string} name - event name
 * @return {boolean} - if it is previously deactivated then true
 * */
export function activateEvent(name: string): boolean {
    if (!isText(name)) {
        throw new DeveloperError('Invalid event name', 'listenEvent#01', where);
    }
    if (deactivatedEvents.has(name)) {
        deactivatedEvents.delete(name);
        return true;
    }
    return false;
}
