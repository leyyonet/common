import type {InitLike, ShiftMain, ShiftSecure} from "../shared";

export type HubType = string|symbol;
/**
 * Callback interface, it collects all jobs and fire them when callback is defined
 * */
export interface HubCommonLike<T extends HubType = string> extends ShiftSecure<HubCommonSecure<T>> {

    /**
     * Cast hub with different type names
     *
     * @return {HubCommonLike} - cast hub
     * */
    as<F extends HubType = string>(): HubCommonLike<T|F>;

    /**
     * List channels
     *
     * @return {Array<HubType>} - channels
     * */
    get channels(): Array<T>;

    /**
     * Remove a channel
     *
     * Notes:
     * - channel should be regular string
     *
     * @param {HubType} channel
     * @return {boolean} - removed or not
     * */
    delete(channel: T): boolean;

    /**
     * Return a channel
     *
     * Notes:
     * - channel should be regular string
     *
     * @param {HubType} channel
     * @return {function} - callback function
     * */
    channel<C extends string = string>(channel: T): HubChannelLike<T, C>;
}

/**
 * Secure hub interface
 * */
export interface HubCommonSecure<T extends HubType = string> extends ShiftMain<HubCommonLike<T>>, InitLike {
}

export interface HubChannelLike<T extends HubType = string, C extends string = string> {

    /**
     * Hub type
     *
     * @type {HubType}
     * */
    readonly type: T;

    /**
     * Cast channel with different channel names
     *
     * @return {HubChannelLike} - cast channel
     * */
    as<F extends string = string>(): HubChannelLike<T, C|F>;

    /**
     * List all names
     *
     * @return {Array<string>} - names
     * */
    get names(): Array<C>;

    /**
     * Set a names
     *
     * Notes:
     * - name should be regular string
     *
     * @param {string} name
     * @param {any} value
     * @return {boolean} - is success, otherwise it already exists
     * */
    set<V>(name: C, value: V): boolean;

    /**
     * Delete a channel from register
     *
     * Notes:
     * - name should be regular string
     *
     * @param {string} name
     * @return {boolean} - removed or not
     * */
    delete(name: C): boolean;

    /**
     * Check a channel exists or not
     *
     * Notes:
     * - name should be regular string
     *
     * @param {string} name
     * @return {boolean} - exists or not
     * */
    has(name: C): boolean;


    /**
     * Return a channel
     *
     * Notes:
     * - channel should be regular string
     *
     * @param {string} name
     * @return {any} - value of channel
     * */
    get<V>(name: C): V;
}
