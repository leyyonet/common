import {Arr} from "../aliases";
import {
    CallbackRec,
    CallbackWhenDefinedLambda,
    CommonCallback,
    CommonCallbackDefined,
    CommonCallbackDefinedInternal,
    CommonCallbackDefinedItem,
    CommonCallbackSecure,
    CommonFqnCb
} from "./index-types";
import {LY_ATTACHED_FQN} from "../constants";
import {Leyyo} from "../leyyo";
import {DeveloperException} from "../error";
import {FQN_PCK} from "../internal";

export class CommonCallbackImpl implements CommonCallback, CommonCallbackSecure {
    private _waitingForCallbacks: Map<string, Array<Arr>>;
    private _attachedCallbacks: Map<string, CallbackRec>;

    private _waitingForProviders: Map<string, Array<CommonCallbackDefinedItem>>;
    private _definedProviders: Map<string, CommonCallbackDefinedInternal>;

    fqnName(value: any): string {
        switch (typeof value) {
            case "function":
                return value.name;
            case "object":
                return value.constructor.name;
            case "string":
                return value;
            default:
                return null;
        }
    }

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
        this._attachedCallbacks = leyyo.storage.newMap<CallbackRec>(`${FQN_PCK}/attachedCallbacks`);
        this._waitingForProviders = leyyo.storage.newMap<Array<CommonCallbackDefinedItem>>(`${FQN_PCK}/waitingForProviders`);
        this._definedProviders = leyyo.storage.newMap<CommonCallbackDefinedInternal>(`${FQN_PCK}/definedProviders`);

        // define itself temporarily for fqn name
        this.defineProvider<CommonFqnCb>(LY_ATTACHED_FQN, CommonCallbackImpl, {
            proper: false,
            name: this.fqnName,
        });

        // when new fqn provider is defined, replace temporary name method
        this.whenProviderDefined<CommonFqnCb>(LY_ATTACHED_FQN, CommonCallbackImpl, (ins) => {
            if (typeof ins.name === 'function') {
                this.fqnName = ins.name;
            }
        });

    }

    /**
     * Clear jobs in the queue which named as pending
     *
     * Because the expected callback may not be defined
     * */
    private _clearPending(): void {
        for (const [name,] of this._waitingForCallbacks.entries()) {
            const rec = this._attachedCallbacks.get(name);
            if (rec && !rec.initialization) {
                continue;
            }
            this._waitingForCallbacks.delete(name);
            console.log(`callback.cleared.pending => {name: ${name}}`)
        }
    }

    get $secure(): CommonCallbackSecure {
        return this;
    }

    attachCallback(name: string, fn: Function): void {
        if (!name || typeof name !== 'string') {
            throw new Error(`callback.invalid.name => {type: ${typeof name}}`);
        }

        // callback attached
        this._attachedCallbacks.set(name, {fn});

        // check waiting records, to be called
        if (this._waitingForCallbacks.has(name)) {
            this._waitingForCallbacks.get(name).forEach(item => {
                fn(...item);
            });
            this._waitingForCallbacks.delete(name);
        }
    }

    queueForCallback(name: string, ...args: Arr): boolean {
        if (!name || typeof name !== 'string') {
            throw new Error(`callback.invalid.name => {type: ${typeof name}}`);
        }
        // callback already exists
        if (this._attachedCallbacks.has(name)) {
            const rec = this._attachedCallbacks.get(name);
            rec.fn(...args);
            return true;
        }

        // callback does not exist yet, so wait to be attached
        if (this._waitingForCallbacks.has(name)) {
            this._waitingForCallbacks.get(name).push(args);
        } else {
            this._waitingForCallbacks.set(name, [args]);
        }
        return false;
    }

    get $back(): CommonCallback {
        return undefined;
    }

    whenProviderDefined<T extends CommonCallbackDefined = CommonCallbackDefined>(name: string, consumer: Function, callback: CallbackWhenDefinedLambda<T>): void {
        if (!name || typeof name !== 'string') {
            throw new DeveloperException(`callback.invalid.name`, {type: typeof name});
        }
        if (!this._waitingForProviders.has(name)) {
            this._waitingForProviders.set(name, []);
        }
        if (this._definedProviders.has(name)) {
            const ins = this._definedProviders.get(name);
            if (ins.producer !== consumer) {
                callback(ins as unknown as T);
            }
        }
        this._waitingForProviders.get(name).push({consumer, callback});
    }

    defineProvider<T extends CommonCallbackDefined = CommonCallbackDefined>(name: string, producer: Function, instance: T): void {
        if (!name || typeof name !== 'string') {
            throw new DeveloperException(`callback.invalid.name`, {type: typeof name});
        }
        const ins = {...instance, producer} as CommonCallbackDefinedInternal;
        this._definedProviders.set(name, ins);
        if (instance.proper) {
            if (this._waitingForProviders.has(name)) {
                this._waitingForProviders.get(name).forEach(item => {
                    if (item.consumer !== producer) {
                        item.callback(instance);
                    }
                });
            }
        }

    }
}