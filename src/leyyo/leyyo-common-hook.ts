import {FQN_PCK} from "../internal";

export class LeyyoCommonHook {
    constructor() {
        throw new Error('LeyyoCommonHook is for only static usage');
    }

    static readonly errorAttached: unique symbol = Symbol.for(`${FQN_PCK}/error.attached`);
    static readonly errorPendingRegister: unique symbol = Symbol.for(`${FQN_PCK}/error.pending`);
    static readonly enumPendingRegister: unique symbol = Symbol.for(`${FQN_PCK}/enum.pending`);
    static readonly fqnAttached: unique symbol = Symbol.for(`${FQN_PCK}/fqn.attached`);
    static readonly fqnPendingRegister: unique symbol = Symbol.for(`${FQN_PCK}/fqn.pending`);
    static readonly logAttached: unique symbol = Symbol.for(`${FQN_PCK}/log.attached`);
    static readonly logPendingRegister: unique symbol = Symbol.for(`${FQN_PCK}/log.pending`);
}