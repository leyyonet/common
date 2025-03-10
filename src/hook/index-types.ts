import {Arr, HookDefinedProvider, HookDefinedProviderLambda, InitLike, ShiftMain, ShiftSecure} from "../shared";

/**
 * Hook interface, it collects all jobs and fire them when callback is defined
 * */
export interface CommonHook extends ShiftSecure<CommonHookSecure> {

    /**
     * Attach a callback
     *
     * @param {string} channel
     * @param {Function} fn
     *
     * Notes:
     * - channel should be regular string
     * - After attached, it should call all waiting calls in the queue
     * */
    attachCallback(channel: string, fn: Function): void;

    /**
     * Add a call into queue, which to be executed by appropriate callback
     *
     * @param {string} channel
     * @param {Array<any>} args
     * @returns {boolean} - channel exists?
     *
     * Notes:
     * - channel should be regular string
     * */
    queueForCallback(channel: string, ...args: Arr): boolean;

    /**
     * Informs when callback is changed
     *
     * @param {string} channel
     * @param {Function} consumer
     * @param {HookDefinedProviderLambda} callback
     *
     * Notes:
     * - channel should be regular string
     * - callback should be regular function
     * - channel should not be already defined
     * */
    whenProviderDefined<T extends HookDefinedProvider = HookDefinedProvider>(channel: string, consumer: Function, callback: HookDefinedProviderLambda<T>): void;


    /**
     * Defines a provider to replace temporary providers
     *
     * @param {string} channel
     * @param {Function} producer
     * @param {Object} instance
     *
     * Notes:
     * - channel should be regular string
     * */
    defineProvider<T extends HookDefinedProvider = HookDefinedProvider>(channel: string, producer: Function, instance: T): void;

}

/**
 * Secure hook interface
 * */
export type CommonHookSecure = ShiftMain<CommonHook> & InitLike;