import {FQN} from "../internal";

import type {
    EventCommonLike, EventCommonSecure,
    EventNameDef
} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import type {Fnc} from "../shared";
import EventEmitter from "node:events";
import {EventError} from "./event.error";

/** @inheritDoc */
export class EventCommon<N extends EventNameDef = EventNameDef> implements EventCommonLike<N>, EventCommonSecure<N> {

    private _listenerMap: Map<N, [number, number]>; // limit, current
    private _bufferLimitAll: number = 0;
    private _bufferLimit: Map<N, number>;
    private _bufferMap: Map<N, Array<Array<unknown>>>;
    private _bufferOnceMap: Map<N, Array<unknown>>;

    /** @inheritDoc */
    readonly native: EventEmitter;

    constructor(private lyy: LeyyoLike) {
        this.native = new EventEmitter();
    }

    private _possibleBufferSize(event: N): number {
        if (this._bufferLimit.has(event)) {
            return this._bufferLimit.get(event);
        }
        return this._bufferLimitAll;
    }
    private _checkBasic(event: unknown): boolean {
        return ['string', 'symbol'].includes(typeof event);
    }
    private _checkEvent(event: unknown, method: keyof EventCommon, silent?: boolean): boolean {
        if (!['string', 'symbol'].includes(typeof event)) {
            if (silent) {
                return false;
            }
            throw new EventError('Invalid event name, not allowed type', {where: `${FQN}.EventCommon`, method, type: typeof event});
        } else if (typeof event === 'string' && (event.trim() !== event || event === '')) {
            throw new EventError('Invalid event name, with space', {where: `${FQN}.EventCommon`, method, event});
        }
        return true;
    }
    private _checkCallback(listener: unknown, method: keyof EventCommon, silent?: boolean): boolean {
        if (typeof listener !== 'function') {
            if (silent) {
                return false;
            }
            throw new EventError('Invalid event function', {where: `${FQN}.EventCommon`, method, type: typeof listener});
        }
        return true;
    }
    private _checkSize(size: unknown, method: keyof EventCommon, silent?: boolean): boolean {
        if (typeof size !== 'number' || !Number.isInteger(size) || size < 0) {
            if (silent) {
                return false;
            }
            throw new EventError('Invalid event size', {where: `${FQN}.EventCommon`, method, type: typeof size, value: size});
        }
        return true;
    }

    /** @inheritDoc */
    get $secure(): EventCommonSecure<N> {
        return this;
    }

    /** @inheritDoc */
    get $back(): EventCommonLike<N> {
        return this;
    }

    /** @inheritDoc */
    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
        });
        this._bufferLimit = this.lyy.repo.newMap(`${FQN}.EventCommon.bufferLimit`);
        this._listenerMap = this.lyy.repo.newMap(`${FQN}.EventCommon.maxListeners`);
        this._bufferMap = this.lyy.repo.newMap(`${FQN}.EventCommon.bufferMap`);
        this._bufferOnceMap = this.lyy.repo.newMap(`${FQN}.EventCommon.bufferOnceMap`);
    }

    // region buffer
    /** @inheritDoc */
    bufferSize(event: N, size: number): EventCommonLike<N> {
        this._checkEvent(event, 'bufferSize');
        this._checkSize(size, 'bufferSize');

        this._bufferLimit.set(event, size);
        return this;
    }

    /** @inheritDoc */
    bufferSizeAll(size: number): EventCommonLike<N> {
        this._checkSize(size, 'bufferSizeAll');

        this._bufferLimitAll = size;
        return this;
    }

    /** @inheritDoc */
    clearBuffer(event: N): number {
        this._checkEvent(event, 'clearBuffer');
        let size = 0;
        if (this._bufferMap.has(event)) {
            size = this._bufferMap.get(event).length;
            this._bufferMap.delete(event);
        }
        return size;
    }

    /** @inheritDoc */
    clearBufferAll(): number {
        let size = 0;
        Array.from(this._bufferMap.values()).forEach(arr => {
            size += arr.length;
        });
        return size;
    }

    /** @inheritDoc */
    hasBuffer(event: N): boolean {
        if (!this._checkBasic(event)) {
            return false;
        }
        return this._bufferMap.has(event);
    }

    // endregion buffer

    // region cast
    /** @inheritDoc */
    as<M extends EventNameDef>(): EventCommonLike<M> {
        return this as unknown as EventCommonLike<M>;
    }
    // endregion cast

    // region register

    private _checkListenerSize(event: N): void {
        if (this._listenerMap.has(event)) {
            let [max, current] = this._listenerMap.get(event);
            current++;
            this._listenerMap.set(event, [max, current]);
            if (current >= max) {
                console.log(`Listener size!, event: ${event as string}, current: ${current}, max: ${max}`)
            }
        }
    }

    private _callBuffer(event: N, listener: Fnc): void {
        if (this._bufferMap.has(event)) {
            this._bufferMap.forEach(args => {
                listener(...args);
            });
            this._bufferMap.delete(event);
        }
    }
    private _callBufferOnce(event: N, listener: Fnc): void {
        if (this._bufferOnceMap.has(event)) {
            listener(...this._bufferOnceMap.get(event));
            this._bufferOnceMap.delete(event);
        }
    }
    /** @inheritDoc */
    addListener(event: N, listener: Fnc): EventCommonLike<N> {
        return this.on(event, listener);
    }

    /** @inheritDoc */
    on(event: N, listener: Fnc): EventCommonLike<N> {

        this._checkEvent(event, 'on');
        this._checkCallback(listener, 'on');

        this._checkListenerSize(event);

        this.native.on(event, listener);
        this._callBuffer(event, listener);
        return this;
    }

    /** @inheritDoc */
    overwrite(event: N, listener: Fnc): EventCommonLike<N> {
        this._checkEvent(event, 'on');
        this._checkCallback(listener, 'on');

        this.native.removeAllListeners(event);
        this.native.on(event, listener);
        this._callBuffer(event, listener);
        return this;
    }

    /** @inheritDoc */
    once(event: N, listener: Fnc): EventCommonLike<N> {
        this._checkEvent(event, 'once');
        this._checkCallback(listener, 'once');

        this.native.once(event, listener);
        this._callBufferOnce(event, listener);

        return this;
    }

    /** @inheritDoc */
    prependListener(event: N, listener: Fnc): EventCommonLike<N> {
        this._checkEvent(event, 'prependListener');
        this._checkCallback(listener, 'prependListener');

        this.native.prependListener(event, listener);
        return this;
    }

    /** @inheritDoc */
    prependOnceListener(event: N, listener: Fnc): EventCommonLike<N> {
        this._checkEvent(event, 'prependOnceListener');
        this._checkCallback(listener, 'prependOnceListener');

        this.native.prependOnceListener(event, listener);
        return this;
    }

    // endregion register

    // region get

    /** @inheritDoc */
    eventNames(): Array<N> {
        return this.native.eventNames() as Array<N>;
    }

    /** @inheritDoc */
    getMaxListeners(): number {
        return this.native.getMaxListeners();
    }

    /** @inheritDoc */
    listenerCount(event: N, listener?: Fnc): number {
        this._checkEvent(event, 'listenerCount');
        return this.native.listenerCount(event, listener);
    }

    /** @inheritDoc */
    listeners(event: N): Array<Fnc> {
        if (!this._checkBasic(event)) {
            return [];
        }
        return this.native.listeners(event) as Array<Fnc>;
    }
    hasListener(event: N): boolean {
        if (!this._checkBasic(event)) {
            return false;
        }

    }

    /** @inheritDoc */
    rawListeners(event: N): Array<Fnc> {
        this._checkEvent(event, 'rawListeners');
        return this.native.rawListeners(event) as Array<Fnc>;
    }
    // endregion get

    // region remove

    /** @inheritDoc */
    off(event: N, listener: Fnc): EventCommonLike<N> {
        this._checkEvent(event, 'off');
        this._checkCallback(listener, 'off');

        this._bufferMap.delete(event);
        this.native.off(event, listener);
        return this;
    }

    /** @inheritDoc */
    removeAllListeners(event?: N): EventCommonLike<N> {
        if (event !== undefined) {
            this._checkEvent(event, 'removeListener');
            this._bufferMap.delete(event);
        }
        this.native.removeAllListeners(event);
        return this;
    }

    /** @inheritDoc */
    removeListener(event: N, listener: Fnc, clearBuffer?: boolean): EventCommonLike<N> {
        this._checkEvent(event, 'removeListener');
        this._checkCallback(listener, 'removeListener');

        if (clearBuffer) {
            this._bufferMap.delete(event);
        }
        this.native.removeListener(event, listener);
        return this;
    }
    // endregion remove

    // region emit

    /** @inheritDoc */
    emitOnce(event: N, ...args: Array<unknown>): boolean {
        return false;
    }

    /** @inheritDoc */
    emit(event: N, ...args: Array<unknown>): boolean {
        if (!this._checkBasic(event)) {
            return false;
        }
        if (!this.native.emit(event, ...args)) {
            const size = this._possibleBufferSize(event);
            if (!size) {
                return false;
            }
            let buffer: Array<Array<unknown>>;
            if (!this._bufferMap.has(event)) {
                buffer = [];
                this._bufferMap.set(event, buffer);
            }
            else {
                buffer = this._bufferMap.get(event);
                if (buffer.length === size) {
                    buffer.shift();
                }
            }
            buffer.push(args);

            if (!this._bufferOnceMap.has(event)) {
                this._bufferOnceMap.set(event, args);
            }

        }
        return true;
    }
    // endregion emit

    // region set

    /** @inheritDoc */
    setMaxListeners(p1: number | N, p2?: number): EventCommonLike<N> {
        let event: N;
        let max: number;
        if (['string', 'symbol'].includes(typeof p1)) {
            event = p1 as N;
            this._checkSize(p2, 'setMaxListeners');
            max = p2 as number;
        }
        else {
            this._checkSize(p1, 'setMaxListeners');
            max = p1 as number;
        }

        if (!event) {
            this.native.setMaxListeners(max);
        }
        else {
            this._listenerMap.set(event, [max, 0]);
        }
        return this;
    }

    // endregion set

}
