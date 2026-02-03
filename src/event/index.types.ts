import type {Fnc, InitLike, ShiftMain, ShiftSecure} from "../shared";
import EventEmitter from "node:events";

export interface EventCommonLike<N extends EventNameDef = EventNameDef> extends ShiftSecure<EventCommonSecure<N>> {
    /**
     * Native event emitter
     * */
    readonly native: EventEmitter;

    /**
     * Cast event emitter to easy use with typed event names
     *
     * @return {EventCommonLike} - this
     * */
    as<M extends EventNameDef>(): EventCommonLike<M>;



    /**
     * Buffer size for given event if event was not defined yet
     *
     * @param {string} event - event name
     * @param {number} size - size of buffer
     * @return {EventCommonLike} - this
     *
     * @default `0` so no buffer
     * */
    bufferSize(event: N, size: number): EventCommonLike<N>;

    /**
     * Buffer size for all events if event was not defined yet
     *
     * @param {number} size - size of buffer
     * @return {EventCommonLike} - this
     *
     * @default `0` so no buffer
     * */
    bufferSizeAll(size: number): EventCommonLike<N>;

    /**
     * Clear buffer for given event
     *
     * @param {string} event - event name
     * @return {number}
     * */
    clearBuffer(event: N): number;

    /**
     * Clear buffer for given event
     *
     * @param {string} event - event name
     * @return {number}
     * */
    hasBuffer(event: N): boolean;

    /**
     * Clear buffer for all events
     *
     * @return {number}
     * */
    clearBufferAll(): number;

    /**
     * Adds the listener function to the end of the listeners array for the event named eventName.
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.on}
     * */
    on(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     * Same with {@link on} but, it clears previos listeners
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     * */
    overwrite(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     * Adds a one-time listener function for the event named eventName.
     * The next time eventName is triggered, this listener is removed and then invoked.
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.once}
     * */
    once(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     * Alias for emitter
     * @see #on
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.addListener}
     * */
    addListener(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     * Synchronously calls each of the listeners registered for the event named eventName,
     * in the order they were registered, passing the supplied arguments to each.
     * Returns true if the event had listeners, false otherwise.
     *
     * @param {string} event - event name
     * @param {...any} args - variadic arguments
     * @return {boolean} - true: if event had listeners
     *
     * {@link NodeJS.EventEmitter.emit}
     * */
    emit(event: N, ...args: Array<unknown>): boolean;

    /**
     * Emit once
     *
     * {@link emit}
     *
     * @param {string} event - event name
     * @param {...any} args - variadic arguments
     * @return {boolean} - true: if event had listeners
     * */
    emitOnce(event: N, ...args: Array<unknown>): boolean;

    /**
     * Return all registered event names
     *
     * @return {Array<string>} - event names
     *
     * {@link NodeJS.EventEmitter.eventNames}
     * */
    eventNames(): Array<N>;

    /**
     * Returns the current max listener value for the EventEmitter which is either set by emitter.
     * setMaxListeners(n) or defaults to EventEmitter.
     *
     * @return {number}
     *
     * {@link NodeJS.EventEmitter.getMaxListeners}
     * */
    getMaxListeners(): number;

    /**
     * Returns the number of listeners listening for the event named eventName.
     * If listener is provided, it will return how many times the listener is found in the list of the listeners of the event.
     *
     * @param {string} event - event name
     * @param {function?} listener - optional listener
     * @return {number} - listener counts for given event
     *
     * {@link NodeJS.EventEmitter.listenerCount}
     * */
    listenerCount(event: N, listener?: Fnc): number;

    /**
     * Returns a copy of the array of listeners for the event named eventName.
     *
     * @param {string} event - event name
     * @return {Array<function>} - array of listeners
     *
     * {@link NodeJS.EventEmitter.listeners}
     * */
    listeners(event: N): Array<Fnc>;

    /**
     * Has a listener
     *
     * @param {string} event - event name
     * @return {boolean} - exists?
     * */
    hasListener(event: N): boolean;

    /**
     * Alias for emitter. removeListener
     * @see #removeListener
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.off}
     * */
    off(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     * Adds the listener function to the beginning of the listeners array for the event named eventName.
     *
     * No checks are made to see if the listener has already been added.
     * Multiple calls passing the same combination of eventName and listener will result in the listener being added, and called, multiple times.
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.prependListener}
     * */
    prependListener(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     *
     * Adds a one-time listener function for the event named eventName to the beginning of the listeners array.
     * The next time eventName is triggered, this listener is removed, and then invoked.
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.prependOnceListener}
     * */
    prependOnceListener(event: N, listener: Fnc): EventCommonLike<N>;

    /**
     * Returns a copy of the array of listeners for the event named eventName,
     * including any wrappers (such as those created by .once()).
     *
     * @param {string} event - event name
     * @return {Array<function>} - Array of listeners
     *
     * {@link NodeJS.EventEmitter.rawListeners}
     * */
    rawListeners(event: N): Array<Fnc>;

    /**
     * Removes all listeners, or those of the specified eventName.
     *
     * It is bad practice to remove listeners added elsewhere in the code,
     * particularly when the EventEmitter instance was created by some other component or module (e. g. sockets or file streams).
     *
     * @param {string} event - event name
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.removeAllListeners}
     * */
    removeAllListeners(event?: N): EventCommonLike<N>;

    /**
     * Removes the specified listener from the listener array for the event named eventName
     *
     * @param {string} event - event name
     * @param {function} listener - callback function
     * @param {boolean?} clearBuffer - clears buffer
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.removeListener}
     * */
    removeListener(event: N, listener: Fnc, clearBuffer?: boolean): EventCommonLike<N>;

    /**
     * By default EventEmitters will print a warning
     * if more than 10 listeners are added for a particular event.
     *
     * This is a useful default that helps finding memory leaks.
     *
     * The emitter. setMaxListeners() method allows the limit to be modified for this specific EventEmitter instance.
     *
     * The value can be set to Infinity (or 0) to indicate an unlimited number of listeners.
     *
     * @param {number} max - maximum number of listener
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.setMaxListeners}
     * */
    setMaxListeners(max: number): EventCommonLike<N>;

    /**
     * Set a maximum listener for a specific event
     *
     * @param {string} event - event name
     * @param {number} max - maximum number of listener
     * @return {EventCommonLike} - this
     *
     * {@link NodeJS.EventEmitter.setMaxListeners}
     * */
    setMaxListeners(event: N, max: number): EventCommonLike<N>;

}

/**
 * Secure event methods
 * */
export type EventCommonSecure<N extends EventNameDef = EventNameDef> = ShiftMain<EventCommonLike<N>> & InitLike;

export type EventNameDef = string | symbol;
