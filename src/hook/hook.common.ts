import type {Arr, ClassLike, Fnc,} from "../shared";
import {LeyyoHookCommon, type LeyyoLike} from "../leyyo";
import {FQN} from "../internal";
import type {
    $HookDefinedProvider,
    HookCommonLike,
    HookCommonSecure,
    HookAttachedCallback,
    HookDefinedProvider,
    HookDefinedProviderLambda,
    HookWaitingProviderItem
} from "./index.types";

// noinspection JSUnusedGlobalSymbols
export class HookCommon implements HookCommonLike, HookCommonSecure {
    private _waitingForCallbacks: Map<symbol, Array<Arr>>;
    private _attachedCallbacks: Map<symbol, HookAttachedCallback>;
    private _waitingForProviders: Map<symbol, Array<HookWaitingProviderItem>>;
    private _definedProviders: Map<symbol, $HookDefinedProvider>;

    /**
     * Default constructor
     *
     * Responsibilities
     * - Create repositories => ie: callbacks
     * - Trigger clear pending operation
     * */
    constructor(private lyy: LeyyoLike) {
    }

    $init(): void {
        this._waitingForCallbacks = this.lyy.repo.newMap<symbol, Array<Arr>>(FQN, 'waitingForCallbacks');
        this._attachedCallbacks = this.lyy.repo.newMap<symbol, HookAttachedCallback>(FQN, 'attachedCallbacks');
        this._waitingForProviders = this.lyy.repo.newMap<symbol, Array<HookWaitingProviderItem>>(FQN, 'waitingForProviders');
        this._definedProviders = this.lyy.repo.newMap<symbol, $HookDefinedProvider>(FQN, 'definedProviders');

        this.lyy.$secure.$lazyRun(() => {
            this.lyy.fqn.register(null, HookCommon, 'class', FQN);
            this.lyy.fqn.register(null, LeyyoHookCommon, 'class', FQN);
        })
    }

    get $secure(): HookCommonSecure {
        return this;
    }

    attachCallback(channel: symbol, fn: Fnc): void {
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.HookCommon`, method: 'attachCallback'}));
        this.lyy.assertion.func(fn, () => this.lyy.dev.opt({field: 'fn', where: `${FQN}.HookCommon`, method: 'attachCallback'}));

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
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.HookCommon`, method: 'queueForCallback'}));

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

    get $back(): HookCommonLike {
        return this;
    }

    whenProviderDefined<T extends HookDefinedProvider = HookDefinedProvider>(channel: symbol, consumer: ClassLike, callback: HookDefinedProviderLambda<T>): void {
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.HookCommon`, method: 'whenProviderDefined'}));
        this.lyy.assertion.func(consumer, () => this.lyy.dev.opt({field: 'consumer', where: `${FQN}.HookCommon`, method: 'whenProviderDefined'}));

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
        this.lyy.assertion.sym(channel, () => this.lyy.dev.opt({field: 'channel', where: `${FQN}.HookCommon`, method: 'defineProvider'}));
        this.lyy.assertion.func(producer, () => this.lyy.dev.opt({field: 'producer', where: `${FQN}.HookCommon`, method: 'defineProvider'}));

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
