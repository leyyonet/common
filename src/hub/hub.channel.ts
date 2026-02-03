import type {BasicType} from "../shared";
import {FQN} from "../internal";
import type {HubChannelLike, HubType} from "./index.types";
import type {RepoCommonLike} from "../repo";
import {InvalidValueError} from "../error";

const WHERE = `${FQN}.HubChannel`;
// noinspection JSUnusedGlobalSymbols
export class HubChannel<T extends HubType = string, C extends string = string> implements HubChannelLike<T, C> {
    // region protected-property
    protected _items: Map<C, unknown>;
    // endregion protected-property

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: callbacks
     * - Trigger clear pending operation
     * */
    constructor(readonly type: T, repo: RepoCommonLike) {
        this._items = repo.newMap(WHERE, 'items');
    }

    // region protected-method

    protected _validName(value: unknown, method?: keyof HubChannelLike, throwable?: boolean): boolean {
        const type = (typeof value) as BasicType;
        if (!['string', 'symbol'].includes(type)) {
            if (!throwable) {
                return false;
            }
            throw new InvalidValueError(`Invalid type of channel with ${type}`, {where: WHERE, method, field: 'name', type});
        }
        if (type === 'string') {
            const str = (value as string).trim();
            if (str === '' || str !== value) {
                if (!throwable) {
                    return false;
                }
                throw new InvalidValueError(`Channel should be trimmed and filled`, {where: WHERE, method, field: 'name'});
            }
        }
        return true;
    }

    // endregion protected-method

    // region getter
    /** @inheritDoc */
    get names(): Array<C> {
        return Array.from(this._items.keys());
    }

    // endregion getter

    // region get
    /** @inheritDoc */
    has(name: C): boolean {
        return this._validName(name) ? this._items.has(name) : false;
    }

    /** @inheritDoc */
    get<V>(name: C): V {
        return this._validName(name) ? this._items.get(name) as V : undefined;
    }
    // endregion get

    // region as
    /** @inheritDoc */
    as<F extends string = string>(): HubChannelLike<T, C | F> {
        return this;
    }
    // endregion as

    // region registration
    /** @inheritDoc */
    set<V>(name: C, value: V): boolean {
        this._validName(name, 'set', true);
        const old = this._items.has(name);
        this._items.set(name, value);
        return old;
    }

    /** @inheritDoc */
    delete(name: C): boolean {
        this._validName(name, 'delete', true);
        if (this._items.has(name)) {
            this._items.delete(name);
            return true;
        }
        return true;
    }
    // endregion registration

}
