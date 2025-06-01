import {Arr, ClassLike, Func,} from "../shared";
import {LeyyoCommonHook, LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import {
    $HookDefinedProvider,
    CommonHookLike,
    CommonHookSecure,
    HookAttachedCallback,
    HookDefinedProvider,
    HookDefinedProviderLambda,
    HookWaitingProviderItem
} from "./index.types";

// noinspection JSUnusedGlobalSymbols
export class CommonHook implements CommonHookLike, CommonHookSecure {
    private lyy: LeyyoLike;
    private _waitingForCallbacks: Map<symbol, Array<Arr>>;
    private _attachedCallbacks: Map<symbol, HookAttachedCallback>;
    private _waitingForProviders: Map<symbol, Array<HookWaitingProviderItem>>;
    private _definedProviders: Map<symbol, $HookDefinedProvider>;

    private timeout: any;

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: callbacks
     * - Trigger clear pending operation
     * */
    constructor() {
    }

    $init(lyy: LeyyoLike): void {
        this.lyy = lyy;
        this._waitingForCallbacks = this.lyy.repo.newMap<symbol, Array<Arr>>(FQN, 'waitingForCallbacks');
        this._attachedCallbacks = this.lyy.repo.newMap<symbol, HookAttachedCallback>(FQN, 'attachedCallbacks');
        this._waitingForProviders = this.lyy.repo.newMap<symbol, Array<HookWaitingProviderItem>>(FQN, 'waitingForProviders');
        this._definedProviders = this.lyy.repo.newMap<symbol, $HookDefinedProvider>(FQN, 'definedProviders');

        // @todo clear after 1 minute
        if (!global?.leyyo_is_testing) {
            this.timeout = setTimeout(() => this._clearPending(), 60_000);
        }

        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, CommonHook, 'class', FQN);
            this.lyy.fqn.register(null, LeyyoCommonHook, 'class', FQN);
        })
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
            console.log(`hook.cleared.pending => {channel: ${channel.description}}`)
        }
    }

    get $secure(): CommonHookSecure {
        return this;
    }

    attachCallback(channel: symbol, fn: Func): void {
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.CommonHook`, method: 'attachCallback'}));
        this.lyy.assertion.func(fn, () => this.lyy.dev.opt({field: 'fn', where: `${FQN}.CommonHook`, method: 'attachCallback'}));

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

    queueForCallback(channel: symbol, ...args: Arr): boolean {
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.CommonHook`, method: 'queueForCallback'}));

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

    get $back(): CommonHookLike {
        return this;
    }

    $clearTimeout(): void {
        if (this.timeout !== undefined) {
            try {
                clearTimeout(this.timeout);
            } catch (e) {
            }
        }
    }


    whenProviderDefined<T extends HookDefinedProvider = HookDefinedProvider>(channel: symbol, consumer: ClassLike, callback: HookDefinedProviderLambda<T>): void {
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.CommonHook`, method: 'whenProviderDefined'}));
        this.lyy.assertion.func(consumer, () => this.lyy.dev.opt({field: 'consumer', where: `${FQN}.CommonHook`, method: 'whenProviderDefined'}));

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

    defineProvider<T extends HookDefinedProvider = HookDefinedProvider>(channel: symbol, producer: ClassLike, instance: T): void {
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.CommonHook`, method: 'defineProvider'}));
        this.lyy.assertion.func(producer, () => this.lyy.dev.opt({field: 'producer', where: `${FQN}.CommonHook`, method: 'defineProvider'}));

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
