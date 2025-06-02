import {Arr, ClassLike, Func, InitLike, ShiftMain, ShiftSecure} from "../shared";

/**
 * Hook interface, it collects all jobs and fire them when callback is defined
 * */
export interface CommonHookLike extends ShiftSecure<CommonHookSecure> {

    /**
     * Attach a callback
     *
     * @param {symbol} channel
     * @param {Func} fn
     *
     * Notes:
     * - channel should be regular string
     * - After attached, it should call all waiting calls in the queue
     * */
    attachCallback(channel: symbol, fn: Func): void;

    /**
     * Add a call into queue, which to be executed by appropriate callback
     *
     * @param {symbol} channel
     * @param {Array<any>} args
     * @returns {boolean} - channel exists?
     *
     * Notes:
     * - channel should be regular string
     * */
    queueForCallback(channel: symbol, ...args: Arr): boolean;

    /**
     * Informs when callback is changed
     *
     * @param {symbol} channel
     * @param {ClassLike} consumer
     * @param {HookDefinedProviderLambda} callback
     *
     * Notes:
     * - channel should be regular string
     * - callback should be regular function
     * - channel should not be already defined
     * */
    whenProviderDefined<T extends HookDefinedProvider = HookDefinedProvider>(channel: symbol, consumer: ClassLike, callback: HookDefinedProviderLambda<T>): void;


    /**
     * Defines a provider to replace temporary providers
     *
     * @param {symbol} channel
     * @param {ClassLike} producer
     * @param {Object} instance
     *
     * Notes:
     * - channel should be regular string
     * */
    defineProvider<T extends HookDefinedProvider = HookDefinedProvider>(channel: symbol, producer: ClassLike, instance: T): void;

}

/**
 * Secure hook interface
 * */
export interface CommonHookSecure extends ShiftMain<CommonHookLike>, InitLike {
}

export interface HookAttachedCallback {
    initialization?: true,
    fn: Func;
}

export interface $HookDefinedProvider extends HookDefinedProvider {
    producer: ClassLike;
}

export interface HookDefinedProvider {
    proper: boolean;
}

export interface HookWaitingProviderItem {
    consumer: ClassLike;
    callback: HookDefinedProviderLambda;
}

export type HookDefinedProviderLambda<T extends HookDefinedProvider = HookDefinedProvider> = (instance: T) => void;
