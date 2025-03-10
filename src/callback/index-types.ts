import {Arr, InitLike, ShiftMain, ShiftSecure} from "../aliases";

/**
 * Callback repository, it collects all jobs and fire them when callback is defined
 * */
export interface CommonCallback extends ShiftSecure<CommonCallbackSecure> {

    /**
     * Attach a callback
     *
     * @param {string} name
     * @param {Function} fn
     *
     * Notes:
     * - name should be regular string
     * - After attached, it should call all waiting calls in the queue
     * */
    attachCallback(name: string, fn: Function): void;

    /**
     * Add a call into queue, which to be executed by appropriate callback
     *
     * @param {string} name
     * @param {Array<any>} args
     * @returns {boolean} - callback exists?
     *
     * Notes:
     * - name should be regular string
     * */
    queueForCallback(name: string, ...args: Arr): boolean;

    fqnName(value: any): string;

    /**
     * Informs when callback is changed
     *
     * @param {string} name
     * @param {Function} consumer
     * @param {CallbackWhenDefinedLambda} callback
     *
     * Notes:
     * - name should be regular string
     * - callback should be regular function
     * - name should not be already defined
     * */
    whenProviderDefined<T extends CommonCallbackDefined = CommonCallbackDefined>(name: string, consumer: Function, callback: CallbackWhenDefinedLambda<T>): void;


    /**
     * Defines a provider to replace temporary providers
     *
     * @param {string} name
     * @param {Function} producer
     * @param {Object} instance
     *
     * Notes:
     * - name should be regular string
     * */
    defineProvider<T extends CommonCallbackDefined = CommonCallbackDefined>(name: string, producer: Function, instance: T): void;

}

export interface CommonCallbackSecure extends ShiftMain<CommonCallback>, InitLike {
}

export interface CallbackRec {
    initialization?: true,
    fn: Function;
}

export interface CommonCallbackDefinedInternal extends CommonCallbackDefined {
    producer: Function;
}

export interface CommonCallbackDefined {
    proper: boolean;
}

export interface CommonCallbackDefinedItem {
    consumer: Function;
    callback: CallbackWhenDefinedLambda;
}

export interface CommonFqnCb extends CommonCallbackDefined {
    name(value: any): string;
}


export type CallbackWhenDefinedLambda<T extends CommonCallbackDefined = CommonCallbackDefined> = (instance: T) => void;