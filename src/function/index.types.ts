import {ClassLike, Describable, ExtendedType, Fnc, Obj, OneOrMore, SetOrMore} from "../base/index.js";
import {Enum, Literal} from "../common/index.js";

// region fqn
export type FqnTarget = ClassLike | Fnc | Obj | Enum | Literal;
export type FqnOnSetLambda = (full: string) => void;
// endregion fqn


// region loader
export type LoaderLike = Array<LoaderItem>;
export type LeyyoStampLambda = () => LoaderItem;
export type LeyyoStampEmpty = () => symbol;
export type LoaderItem =
    ClassLike
    | Fnc
    | Enum
    | Literal
    | Obj
    | LeyyoStampLambda
    | LeyyoStampEmpty
    | LoaderLike;
// endregion loader

// region option
export type OptReason = 'invalid' | 'unexpected' | 'not:allowed' | 'not:found' | 'duplicated' | 'empty' | 'conflicted';

export interface Opt<R extends string = string> extends Obj {
    issue?: SetOrMore<OptReason | R | string>;
    message?: SetOrMore<string>;
    field?: string;
    param?: SetOrMore<unknown>;
    where?: SetOrMore<string>;
    value?: SetOrMore<unknown>;
    expected?: SetOrMore<ExtendedType | string> | OneOrMore<ExtendedType | string>;
    type?: SetOrMore<ExtendedType | string>;
    method?: SetOrMore<string>;
    case?: SetOrMore<unknown>;
    desc?: SetOrMore<Describable | string>;
    error?: SetOrMore<{ name: string, message: string }>,
    assert?: SetOrMore<string>;

    [k: string]: unknown;
}

export type OptFn<O extends Opt = Opt> = () => O;
export type OptAny<O extends Opt = Opt> = O | OptFn<O>;
// endregion option

// region exporter
export type ExporterData = Record<string, ExporterValue>;
export type ExporterValue = Record<string, unknown>;

export interface ExporterDepot {
    add(name: string, value: ExporterValue): void;
}

// endregion exporter

export interface LeyyoConfig {
    [fqn: string]: Record<string, unknown>;
}
