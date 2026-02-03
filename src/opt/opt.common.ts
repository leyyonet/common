import {FQN} from "../internal";
import type {Opt, OptCommonLike, OptCommonSecure, OptFn} from "./index.types";
import type {LeyyoLike} from "../leyyo";
import {secureClone} from "../util";

export class OptCommon implements OptCommonLike, OptCommonSecure {
    constructor(private lyy: LeyyoLike) {
    }
    fn<O extends Opt = Opt>(opt: O|Opt): O {
        return opt as O;
    }
    check<O extends Opt = Opt>(opt: O|OptFn<O>|Opt): O {
        opt = opt ?? {} as O;
        if (typeof opt === 'function') {
            opt = opt() as O;
        }
        return opt as O;
    }
    clone<O extends Opt = Opt>(opt: O|OptFn<O>|Opt): O {
        return secureClone(this.check(opt)) as O;
    }
    append<O extends Opt = Opt>(opt: O|Opt, appended: O|Opt): O {
        if (typeof appended === 'object' && !Array.isArray(appended)) {
            let o = (opt ?? {}) as O;
            for (const [k, v] of Object.entries(appended)) {
                if (o[k] === undefined) {
                    o[k as keyof O] = v as O[keyof O];
                }
                else {
                    o = this.add(o, k, v);
                }
            }
            return o;
        }
        return opt as O;
    }

    add<O extends Opt = Opt>(opt: O|OptFn<O>|Opt, key: keyof O|string, value: unknown): O {
        let o = this.check(opt);
        if (value === undefined || typeof key !== 'string') {
            return o;
        }
        if (key === 'field') {
            return this.field(o, value as string);
        }
        if (o[key] === undefined) {
            o[key as keyof O] = value as O[keyof O];
        }
        else if (o[key] instanceof Set) {
            o[key].add(value);
        }
        else {
            o[key as keyof O] = new Set([o[key], value]) as O[keyof O];
        }
        return o;
    }
    field<O extends Opt = Opt>(opt: O|OptFn<O>|Opt, field: string|number): O {
        const o = this.check(opt);
        const t = typeof field;
        if (!['string', 'number'].includes(t)) {
            return o;
        }
        if (o.field !== undefined) {
            if (typeof o.field !== 'string') {
                o.field = '';
            }
        }
        else {
            o.field = '';
        }

        if (o.field === '') {
            o.field = (t === 'string') ? (field as string) : `$.[${field}]`;
        }
        else {
            o.field += (t === 'string') ? `.${field}` : `[${field}]`;
        }
        return o;
    }


    // region secure
    get $secure(): OptCommonSecure {
        return this;
    }

    get $back(): OptCommonLike {
        return this;
    }

    $init(): void {
        this.lyy.$secure.$lazyRun(() => {
            this.lyy.event.emit('ly:fqn:register', 'class', FQN, OptCommon)
        });
    }
    // endregion secure
}
