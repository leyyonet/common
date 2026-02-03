import type {BasicType} from "../shared";
import type {LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import type {HubChannelLike, HubCommonLike, HubCommonSecure, HubType} from "./index.types";
import {HubChannel} from "./hub.channel";
import {InvalidValueError} from "../error";

const WHERE = `${FQN}.HubCommon`;
// noinspection JSUnusedGlobalSymbols
export class HubCommon<T extends HubType = string> implements HubCommonLike<T>, HubCommonSecure<T> {
    // region protected-property
    protected _channels: Map<T, HubChannelLike>;
    // endregion protected-property

    /**
     * Default constructor
     * */
    constructor(private lyy: LeyyoLike) {
    }

    // region protected-method

    protected _validChannel(value: unknown, method?: keyof HubCommonLike, throwable?: boolean): boolean {
        const type = (typeof value) as BasicType;
        if (!['string', 'symbol'].includes(type)) {
            if (!throwable) {
                return false;
            }
            throw new InvalidValueError(`Invalid type of channel with ${type}`, {where: WHERE, method, field: 'channel', type});
        }
        if (type === 'string') {
            const str = (value as string).trim();
            if (str === '' || str !== value) {
                if (!throwable) {
                    return false;
                }
                throw new InvalidValueError(`Channel should be trimmed and filled`, {where: WHERE, method, field: 'channel'});
            }
        }
        return true;
    }

    // endregion protected-method

    // region secure
    /** @inheritDoc */
    $init(): void {
        this._channels = this.lyy.repo.newMap<T, HubChannelLike>(WHERE, 'channels');

        this.lyy.$secure.$lazyRun(() => {
        });
    }

    /** @inheritDoc */
    get $secure(): HubCommonSecure<T> {
        return this;
    }

    /** @inheritDoc */
    get $back(): HubCommonLike<T> {
        return this;
    }
    // endregion secure

    // region getter
    /** @inheritDoc */
    get channels(): Array<T> {
        return Array.from(this._channels.keys());
    }

    // endregion getter

    // region get
    /** @inheritDoc */
    has(channel: T): boolean {
        return this._validChannel(channel) ? this._channels.has(channel) : false;
    }

    /** @inheritDoc */
    channel<C extends string = string>(channel: T): HubChannelLike<T, C> {
        this._validChannel(channel, 'channel', true);
        if (!this._channels.has(channel)) {
            this._channels.set(channel, new HubChannel<T>(channel, this.lyy.repo) as HubChannelLike);
        }
        return this._channels.get(channel) as HubChannelLike<T, C>;
    }
    // endregion get

    // region as
    /** @inheritDoc */
    as<F extends HubType = string>(): HubCommonLike<T | F> {
        return this;
    }
    // endregion as

    // region registration
    /** @inheritDoc */
    delete(channel: T): boolean {
        this._validChannel(channel, 'delete', true);
        if (this._channels.has(channel)) {
            this._channels.delete(channel);
            return true;
        }
        return true;
    }
    // endregion registration
}
