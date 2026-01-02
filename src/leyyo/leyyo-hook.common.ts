import {FQN} from "../internal";

export class LeyyoHookCommon {
    constructor() {
        throw new Error('LeyyoHookCommon is for only static usage');
    }

    static readonly errorAttached: unique symbol = Symbol.for(`${FQN}/error.attached`);
    static readonly errorPendingRegister: unique symbol = Symbol.for(`${FQN}/error.pending`);
    static readonly enumPendingRegister: unique symbol = Symbol.for(`${FQN}/enum.pending`);
    static readonly fqnAttached: unique symbol = Symbol.for(`${FQN}/fqn.attached`);
    static readonly fqnPendingRegister: unique symbol = Symbol.for(`${FQN}/fqn.pending`);
    static readonly logAttached: unique symbol = Symbol.for(`${FQN}/log.attached`);
    static readonly logPendingRegister: unique symbol = Symbol.for(`${FQN}/log.pending`);
}
