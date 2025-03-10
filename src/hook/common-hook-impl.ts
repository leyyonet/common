import {
    $HookDefinedProvider,
    Arr,
    HookAttachedCallback,
    HookDefinedProvider,
    HookDefinedProviderLambda,
    HookWaitingProviderItem
} from "../shared";
import {Leyyo} from "../leyyo";
import {FQN_PCK} from "../internal";
import {CommonHook, CommonHookSecure} from "./index-types";
import {DeveloperException} from "../exception";

// noinspection JSUnusedGlobalSymbols
export class CommonHookImpl implements CommonHook, CommonHookSecure {
    private _waitingForCallbacks: Map<string, Array<Arr>>;
    private _attachedCallbacks: Map<string, HookAttachedCallback>;

    private _waitingForProviders: Map<string, Array<HookWaitingProviderItem>>;
    private _definedProviders: Map<string, $HookDefinedProvider>;

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: callbacks
     * - Trigger clear pending operation
     * */
    constructor() {
        // clear after 1 minute
        setTimeout(() => this._clearPending(), 60_000);
    }

    $init(leyyo: Leyyo): void {
        this._waitingForCallbacks = leyyo.storage.newMap<Array<Arr>>(`${FQN_PCK}/waitingForCallbacks`);
        this._attachedCallbacks = leyyo.storage.newMap<HookAttachedCallback>(`${FQN_PCK}/attachedCallbacks`);
        this._waitingForProviders = leyyo.storage.newMap<Array<HookWaitingProviderItem>>(`${FQN_PCK}/waitingForProviders`);
        this._definedProviders = leyyo.storage.newMap<$HookDefinedProvider>(`${FQN_PCK}/definedProviders`);
    }

    /**
     * Clear jobs in the queue which channel as pending
     *
     * Because the expected callback may not be defined
     * */
    private _clearPending(): void {
        for (const [channel,] of this._waitingForCallbacks.entries()) {
            const rec = this._attachedCallbacks.get(channel);
            if (rec && !rec.initialization) {
                continue;
            }
            this._waitingForCallbacks.delete(channel);
            console.log(`hook.cleared.pending => {channel: ${channel}}`)
        }
    }

    get $secure(): CommonHookSecure {
        return this;
    }

    attachCallback(channel: string, fn: Function): void {
        if (!channel || typeof channel !== 'string') {
            throw new Error(`hook.invalid.channel => {type: ${typeof channel}}`);
        }

        // callback attached
        this._attachedCallbacks.set(channel, {fn});

        // check waiting records, to be called
        if (this._waitingForCallbacks.has(channel)) {
            this._waitingForCallbacks.get(channel).forEach(item => {
                fn(...item);
            });
            this._waitingForCallbacks.delete(channel);
        }
    }

    queueForCallback(channel: string, ...args: Arr): boolean {
        if (!channel || typeof channel !== 'string') {
            throw new Error(`hook.invalid.channel => {type: ${typeof channel}}`);
        }
        // callback already exists
        if (this._attachedCallbacks.has(channel)) {
            const rec = this._attachedCallbacks.get(channel);
            rec.fn(...args);
            return true;
        }

        // callback does not exist yet, so wait to be attached
        if (this._waitingForCallbacks.has(channel)) {
            this._waitingForCallbacks.get(channel).push(args);
        } else {
            this._waitingForCallbacks.set(channel, [args]);
        }
        return false;
    }

    get $back(): CommonHook {
        return undefined;
    }

    whenProviderDefined<T extends HookDefinedProvider = HookDefinedProvider>(channel: string, consumer: Function, callback: HookDefinedProviderLambda<T>): void {
        if (!channel || typeof channel !== 'string') {
            throw new DeveloperException(`hook.invalid.channel`, {type: typeof channel});
        }
        if (!this._waitingForProviders.has(channel)) {
            this._waitingForProviders.set(channel, []);
        }
        if (this._definedProviders.has(channel)) {
            const ins = this._definedProviders.get(channel);
            if (ins.producer !== consumer) {
                callback(ins as unknown as T);
            }
        }
        this._waitingForProviders.get(channel).push({consumer, callback});
    }

    defineProvider<T extends HookDefinedProvider = HookDefinedProvider>(channel: string, producer: Function, instance: T): void {
        if (!channel || typeof channel !== 'string') {
            throw new DeveloperException(`hook.invalid.channel`, {type: typeof channel});
        }
        const ins = {...instance, producer} as $HookDefinedProvider;
        this._definedProviders.set(channel, ins);
        if (instance.proper) {
            if (this._waitingForProviders.has(channel)) {
                this._waitingForProviders.get(channel).forEach(item => {
                    if (item.consumer !== producer) {
                        item.callback(instance);
                    }
                });
            }
        }

    }
}