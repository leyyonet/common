import type {
    ClassLike,
    Describable,
    ExtendedType, Fnc,
    InitLike,
    Obj,
    OneOrMore, SetOrMore,
    ShiftMain,
    ShiftSecure
} from "../shared";

export type OptReason = 'invalid' | 'unexpected' | 'not:allowed' | 'not:found' | 'duplicated' | 'empty' | 'conflicted';
export interface Opt<R extends string = string> extends Obj {
    // todo remove OneOrMore
    issue?: SetOrMore<OptReason | R | string> | OneOrMore<OptReason | R | string>;
    message?: SetOrMore<string> | OneOrMore<string>;
    field?: string;
    param?: SetOrMore<unknown> | OneOrMore<unknown>;
    where?: SetOrMore<ClassLike|Fnc|string> | OneOrMore<ClassLike|Fnc|string>;
    value?: SetOrMore<unknown> | OneOrMore<unknown>;
    expected?: SetOrMore<ExtendedType|string> | OneOrMore<ExtendedType|string>;
    type?: SetOrMore<ExtendedType|string> | OneOrMore<ExtendedType|string>;
    method?: SetOrMore<string> | OneOrMore<string>;
    case?: SetOrMore<unknown> | OneOrMore<unknown>;
    desc?: SetOrMore<Describable|string> | OneOrMore<Describable|string> | unknown;
    error?: SetOrMore<{name: string, message: string}>,
    assert?: SetOrMore<string>;

    [k: string]: unknown;
}
export type OptFn<O extends Opt = Opt> = () => O;
export type OptAny<O extends Opt = Opt> = O|OptFn<O>;

export interface OptCommonLike extends ShiftSecure<OptCommonSecure> {
    fn<O extends Opt = Opt>(opt: O|Opt): O;
    check<O extends Opt = Opt>(opt: O|OptFn<O>|Opt): O;
    clone<O extends Opt = Opt>(opt: O|OptFn<O>|Opt): O;
    append<O extends Opt = Opt>(opt: O|Opt, appended: O|Opt): O;
    field<O extends Opt = Opt>(opt: O|OptFn<O>|Opt, field: string|number): O;
    add<O extends Opt = Opt>(opt: O|OptFn<O>|Opt, key: keyof O|string, value: unknown): O;
}
export interface OptCommonSecure extends ShiftMain<OptCommonLike>, InitLike {
}
