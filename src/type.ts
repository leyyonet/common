// region basic
import EventEmitter from "node:events";

/**
 * JS types
 * @enum
 * */
export type BasicType =
  | "undefined"
  | "string"
  | "object"
  | "number"
  | "boolean"
  | "function"
  | "symbol"
  | "bigint";

/**
 * Extended types
 * @enum
 * */
export type ExtendedType =
  | BasicType
  | "array"
  | "null"
  | "enum-map"
  | "literal-items"
  | "class"
  | "empty"
  | "text"
  | "nan"
  | "integer"
  | "date"
  | "map"
  | "set"
  | "list";
/**
 * Possible key values
 * */
export type KeyValue = string | number;

/**
 * Possible visible and hidden key values
 * */
export type AnyKey = string | number | symbol;

/**
 * Http status
 * */
export type HttpStatus = number;

/**
 * Language code
 * - it will be extended with literal, as en, it, de, tr, ...
 * */
export type LangLike = string;

/**
 * Possible name value
 * */
export type NameLike = string;

/**
 * Possible keyword value
 * */
export type KeywordLike = string;

/**
 * Possible field name value
 * */
export type FieldNameLike = string;

/**
 * Possible id value
 * */
export type IdLike = string | number;

/**
 * Shortcut for integer
 * */
export type IntegerLike = number;

/**
 * Shortcut for float, double
 * */
export type FloatLike = number;

/**
 * Shortcut for alphanumeric
 * Format: [azAZ09_]
 * */
export type AlphaLike = string;

/**
 * Shortcut for slug
 * Format: aaa-bbb-ccc
 * */
export type SlugLike = string;

/**
 * Shortcut for text, trimmed string
 * */
export type TextLike = string;

/**
 * Shortcut for digit
 * - digitType, 0-9
 * */
export type DigitLike = string;

/**
 * Shortcut for title
 * - Single-line clear-text (no html)
 * */
export type TitleLike = string;

/**
 * Shortcut for description
 * - Multi-line clear-text (no html)
 * */
export type DescriptionLike = string;

/**
 * Shortcut for rich text
 * - multi-line rich text with html tags
 * */
export type RichTextLike = string;

/**
 * Shortcut for uuid
 * */
export type UuidLike = string;

/**
 * Shortcut for host
 * - Format: [subdomain.]domain.extension
 * */
export type HostLike = string;

/**
 * Shortcut for URI
 * - Format: http[s]://[subdomain.]domain.extension[/path]
 * */
export type UriLike = string;

/**
 * Shortcut for url
 * - Format: http[s]://[subdomain.]domain.extension[/path]
 * */
export type UrlLike = string;

/**
 * Shortcut for email
 * - Format: aaa@bbb.ccc
 * */
export type EmailLike = string;

/**
 * Shortcut for folder
 * - Format: aaa/bbb/ccc
 * */
export type FolderLike = string;

/**
 * Shortcut for phone
 * */
export type PhoneLike = string;

/**
 * Shortcut for urn
 * - Format: aaa:bbb:ccc
 * */
export type UrnLike = string;

/**
 * Shortcut for hash
 * */
export type HashText = string;

/**
 * Shortcut for encrypted
 * */
export type EncryptedText = string;

/**
 * Shortcut for timestamp
 * - Unit: milliseconds
 * */
export type Timestamp = number;
/**
 * Shortcut for timestamp
 * - Unit: milliseconds
 * */
export type TimeLong = Timestamp;

/**
 * Shortcut for ttl
 * - Unit: milliseconds
 * */
export type TtlMsec = number;
/**
 * Shortcut for ttl
 * - Unit: milliseconds
 * */
export type TtlLong = TtlMsec;

/**
 * Shortcut for epoch time
 * - Unit: second
 * */
export type EpochTime = number;

/**
 * Shortcut for epoch time
 * - Unit: second
 * */
export type TimeShort = EpochTime;

/**
 * Shortcut for ttl
 * - Unit: second
 * */
export type TtlSecond = number;

/**
 * Shortcut for ttl as seconds
 * */
export type TtlShort = TtlSecond;

/**
 * Shortcut for iso date time
 * - Format: yyyy-mm-ddThh:mm:ii.eeeZ
 * */
export type IsoDatetime = string;

/**
 * Shortcut for iso date
 * - Format: yyyy-mm-dd
 * */
export type IsoDate = string;

/**
 * Shortcut for iso time
 * - Format: hh:mm:ii.eeeZ
 * */
export type IsoTime = string;
// endregion alias

// region function
/**
 * Any function
 * */
export type Fnc<R = unknown> = ((...args: Arr) => R) & Function;

/**
 * Any async function
 * */
export type Async<R = unknown> = ((...args: Arr) => Promise<R>) & AsyncGeneratorFunction;

/**
 * Abstract class without new method
 *
 * Generics:
 * - C: class
 * */
export interface Abstract<C = {}> extends Function {
  /**
   * Prototype
   * */
  prototype: C;

  /**
   * Name of class
   * */
  readonly name: string;

  /**
   * Parameter size of constructor
   * */
  readonly length: number;

  /**
   * Bind a class function
   * */
  bind(thisArg: unknown, ...args: Arr): unknown;

  /**
   * Apply a class function
   * */
  apply(thisArg: unknown, args: Arr): unknown;

  /**
   * Call a class function
   * */
  call(thisArg: unknown, ...args: Arr): unknown;
}

/**
 * Class interface with new method
 *
 * Generics:
 * - C: class
 * */
export interface ClassLike<C = {}> extends Abstract<C> {
  /**
   * Constructor
   * @param {Array<any>} args
   * @return {Obj}
   * */
  new (...args: Arr): C;
}

/**
 * Get type of class
 *
 * Generics:
 * - C: class
 * */
export type TypeOf<C = ClassLike> = C extends ClassLike<infer T> ? T : C;

// endregion function

// region express
export declare namespace Express {
  export interface Request {
    local?: Rec;
  }

  export interface Response {
    local?: Rec;
  }
}
// endregion express

// region utility
/**
 * Has Description interface
 * */
export interface HasDescription {
  /**
   * Description
   * */
  description: string;
}

/**
 * Has Name interface
 * */
export interface HasName {
  /**
   * Name
   * */
  name?: string | unknown;
}

/**
 * Has Id interface
 * */
export interface HasId {
  /**
   * Id
   * */
  id?: IdLike;
}

/**
 * Has Urn interface
 * */
export interface HasUrn {
  /**
   * Urn
   * */
  urn?: UrnLike;
}

/**
 * Easy object type
 * */
export type Obj = object & {};

/**
 * Easy array type
 *
 * Generics:
 * - T: type of item
 * */
export type Arr<T = unknown> = Array<T>;

/**
 * Easy record type
 *
 * Generics:
 * - T: type of item
 * */
export type Rec<T = unknown> = Record<KeyValue, T>;

/**
 * Returns type of method
 *
 * Generics:
 * - T: type of object
 * - M: method name
 * */
export type TypeOfMethod<T, M extends keyof T> = T[M] extends Function ? T[M] : never;

/**
 * Returns type of function
 *
 * Generics:
 * - F: type of function
 * - R: return of function
 * */
export type TypeOfFnc<F extends Fnc> = F extends (...args: Arr) => infer R ? R : never;

/**
 * Returns type of async function
 *
 * Generics:
 * - F: type of function
 * - R: return of function
 * */
export type TypeOfAsync<F extends Async> = TypeOfPromise<TypeOfFnc<F>>;

/**
 * Returns type of promise
 *
 * Generics:
 * - P: type of promise
 * - R: return of promise
 * */
export type TypeOfPromise<P> = P extends Promise<infer R> ? R : P;

/**
 * String keys of an interface
 * - Note: keyof keywords returns string|number|symbol, but it's ignore number and symbol keys
 * */
export type StrKey<T> = Extract<keyof T, string>;

/**
 * Serialized version of another type
 */
export type Serialized<T> = { [P in keyof T]: T[P] };

/**
 * Makes mutable an interface
 *
 * @see Readonly
 * */
export type Mutable<A> = { -readonly [K in keyof A]: A[K] };

/**
 * Build keyof
 * */
export type KeyOf<T> = keyof T;

/**
 * Build array of keyof
 * */
export type Keys<T> = Array<keyof T>;

/**
 * Build value of
 * */
export type ValueOf<T> = T[KeyOf<T>];

/**
 * Build array of value of
 * */
export type Values<T> = Array<T[KeyOf<T>]>;

/**
 * One or more
 * */
export type OneOrMore<T> = T | Array<T>;

/**
 * Set or more
 * */
export type SetOrMore<T> = T | Set<T>;

/**
 * List members by given type as `literal`
 *
 * Generics:
 * - T: object
 * - I: expected type
 * */
export type IgnoreFieldsByType<T, I> = {
  [K in keyof T]: T[K] extends I ? K : never;
}[keyof T];

/**
 * List replaced types of interface
 *
 * Generics:
 * - T: object
 * - O: old/replaced type
 * - N: new/replacing type
 * */
export type ReplaceType<T, O, N> = {
  [P in keyof T]: T[P] extends O ? N : T[P];
};

/**
 * Build same member types
 *
 * Generics:
 * - T: interface
 * - M: member type
 * */
export type SameType<T, M> = {
  [K in keyof T]: M;
};

/**
 * Pick members for only given types
 *
 * Generics:
 * - T: interface
 * - M: picked member type
 * */
export type PickByType<T, M> = {
  [K in keyof T]: T[K] extends M ? K : never;
};

/**
 * Pick members for only given types as `literal`
 *
 * Generics:
 * - T: interface
 * - M: picked member type
 * */
export type PickKeyByType<T, M> = PickByType<T, M>[keyof T];

/**
 * Omit members for only given types
 *
 * Generics:
 * - T: interface
 * - M: omitted member type
 * */
export type OmitByType<T, M> = {
  [K in keyof T]: T[K] extends M ? never : K;
};

/**
 * Omit members for only given types as `literal`
 *
 * Generics:
 * - T: interface
 * - M: omit member type
 * */
export type OmitKeysByType<T, M> = OmitByType<T, M>[keyof T];

/**
 * Value or callback
 * - it can be expected type
 * - it can be a function returns expected type
 * - it can be a async function returns expected type
 *
 * Generics:
 * - T: expected type
 * */
export type ValueOrCallback<T> = T | ValueCallback<T> | ValueCallbackAsync<T>;

/**
 * A callback return expected type
 *
 * Generics:
 * - T: expected type
 * */
export type ValueCallback<T> = (...args: Array<unknown>) => T;

/**
 * An async callback return expected type
 *
 * Generics:
 * - T: expected type
 * */
export type ValueCallbackAsync<T> = (...args: Array<unknown>) => Promise<T>;

export type CamelToConstItem<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Uppercase<T>}${CamelToConstItem<U>}`
    : `${Uppercase<T>}_${CamelToConstItem<U>}`
  : Uppercase<S>;
export type CamelToConst<T> = {
  [K in keyof T as CamelToConstItem<string & K>]: T[K];
};

type ConstToCamelItem<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<ConstToCamelItem<U>>}`
  : Lowercase<S>;
export type ConstToCamel<T> = {
  [K in keyof T as ConstToCamelItem<string & K>]: T[K];
};

type SnakeToCamelItem<S extends string> = S extends `${infer T}_${infer U}`
  ? `${Lowercase<T>}${Capitalize<SnakeToCamelItem<U>>}`
  : Lowercase<S>;
export type SnakeToCamel<T> = {
  [K in keyof T as SnakeToCamelItem<string & K>]: T[K];
};

type CamelToSnakeItem<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${CamelToSnakeItem<U>}`
    : `${Lowercase<T>}_${CamelToSnakeItem<U>}`
  : Lowercase<S>;
export type CamelToSnake<T> = {
  [K in keyof T as CamelToSnakeItem<string & K>]: T[K];
};

export type MaximumOneOf<T, K extends keyof T = keyof T> = K extends keyof T
  ? {
      [P in K]: T[K];
    } & Partial<Record<Exclude<keyof T, K>, never>>
  : never;
export type OneOf<Obj> = ValueOf<_OneOfByKey<Obj>>;
export type Xor<A, B> =
  | _XorIn<A & { [K in keyof B]?: undefined }>
  | _XorIn<B & { [K in keyof A]?: undefined }>;
type _OneOnly<T, K extends keyof T> = Omit<T, Exclude<keyof T, K>> | Pick<T, K>;
type _OneOfByKey<T> = { [key in keyof T]: _OneOnly<T, key> };
type _XorIn<T> = { [K in keyof T]: T[K] } & unknown;

// endregion utility

// region shift
/**
 * An interface which contains secure mode members and provides to shift to main mode
 * */
export interface ShiftSecure<S extends ShiftMain<any>> {
  /**
   * Shifts to secure mode
   * */
  get $secure(): S;
}

/**
 * An interface which contains main mode members and provides to shift to secure mode
 *
 * IT's so useful to hide some public members
 * - to see clean auto-completed members in IDE
 * - to indicated that secure mode members should be used in special cases
 * */
export interface ShiftMain<M extends ShiftSecure<any>> {
  /**
   * Shifts to main mode
   * */
  get back(): M;
}

/**
 * An interface which provides to flat generic interfaces/classes to prevent verbose casting commands
 * */
export interface ShiftFlat<D> {
  /**
   * Flats current classes, or eliminate generic parameters
   * */
  get $flat(): D;
}

// endregion shift

// region json
/**
 * Stringified json
 * - T generics is use for only information
 * */
export type JsonText<T = unknown> = string;
/**
 * JSON Object, record of `JsonValue`
 *
 * @see #JsonValue
 */
export type JsonObject = { [K in string]?: JsonValue };
/**
 * JSON Array, array of `JsonValue`
 *
 * @see #JsonValue
 */
export type JsonArray = Array<JsonValue>;

/**
 * JSON Primitive
 *
 * `OneOf`
 * @see `string`
 * @see `number`
 * @see `boolean`
 * @see `null`
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON Value
 *
 * `OneOf`
 * @see #JsonPrimitive
 * @see #JsonObject
 * @see #JsonArray
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
// endregion json

// region list
/**
 * Extended array interface, ie: Clearable arrays
 * */
export interface ListLike<T = unknown> extends Array<T> {
  /**
   * Clears array items, to align all iteration repositories, like Set, Map etc
   *
   * @return {number} - returns deleted count
   * */
  clear(): number;

  /**
   * Deletes given item
   *
   * @param {any} value - will be deleted record
   * @return {boolean} - is deleted?
   * */
  delete(value: T): boolean;

  /**
   * Deletes by given predicate
   *
   * @param {function} predicate - lambda expression
   * @return {boolean} - is deleted?
   * */
  deleteByLambda(predicate: ListPredicate<T>): boolean;
}

export type ListPredicate<T = unknown> = (value: T, index?: number, arr?: Array<T>) => T;
// endregion list

// region logger
/**
 * Log levels
 * */
export type LogLevel = "debug" | "trace" | "info" | "warn" | "error" | "fatal";

/**
 * Logger interface
 * */
export interface Logger extends ShiftSecure<LoggerSecure> {
  /**
   * Debug log
   *
   * @param {string} message
   * @param {Opt} params
   * */
  debug(message: string, params?: any | Opt): void;

  /**
   * Debug log
   *
   * @param {Error} error
   * @param {Opt} params
   * */
  debug(error: Error, params?: any | Opt): void;

  /**
   * Debug log
   *
   * @param {any} whatever
   * @param {Opt} params
   * */
  debug(whatever: any, params?: any | Opt): void;

  /**
   * Trace log
   *
   * @param {string} message
   * @param {Opt} params
   * */
  trace(message: string, params?: any | Opt): void;

  /**
   * Trace log
   *
   * @param {Error} error
   * @param {Opt} params
   * */
  trace(error: Error, params?: any | Opt): void;

  /**
   * Trace log
   *
   * @param {any} whatever
   * @param {Opt} params
   * */
  trace(whatever: any, params?: any | Opt): void;

  /**
   * Info log
   *
   * @param {string} message
   * @param {Opt} params
   * */
  info(message: string, params?: any | Opt): void;

  /**
   * Info log
   *
   * @param {Error} error
   * @param {Opt} params
   * */
  info(error: Error, params?: any | Opt): void;

  /**
   * Info log
   *
   * @param {any} whatever
   * @param {Opt} params
   * */
  info(whatever: any, params?: any | Opt): void;

  /**
   * Warning log
   *
   * @param {string} message
   * @param {Opt} params
   * */
  warn(message: string, params?: any | Opt): void;

  /**
   * Warning log
   *
   * @param {Error} error
   * @param {Opt} params
   * */
  warn(error: Error, params?: any | Opt): void;

  /**
   * Warning log
   *
   * @param {any} whatever
   * @param {Opt} params
   * */
  warn(whatever: any, params?: any | Opt): void;

  /**
   * Error log
   *
   * @param {string} message
   * @param {Opt} params
   * */
  error(message: string, params?: any | Opt): void;

  /**
   * Error log
   *
   * @param {Error} error
   * @param {Opt} params
   * */
  error(error: Error, params?: any | Opt): void;

  /**
   * Error log
   *
   * @param {any} whatever
   * @param {Opt} params
   * */
  error(whatever: any, params?: any | Opt): void;

  /**
   * Fatal log
   *
   * @param {string} message
   * @param {Opt} params
   * */
  fatal(message: string, params?: any | Opt): void;

  /**
   * Fatal log
   *
   * @param {Error} error
   * @param {Opt} params
   * */
  fatal(error: Error, params?: any | Opt): void;

  /**
   * Fatal log
   *
   * @param {any} whatever
   * @param {Opt} params
   * */
  fatal(whatever: any, params?: any | Opt): void;
}

/**
 * Logger secure interface
 * */
export interface LoggerSecure extends ShiftMain<Logger> {
  /**
   * Return name of logger
   *
   * @return {string}
   * */
  get $name(): string;

  /**
   * Refresh name of logger
   *
   * @param {string} name - new name
   * */
  $refreshName(name: string): void;

  /**
   * Refresh log levels
   *
   * @param {LogLevel} level - max level
   * */
  $refreshLevels(level: LogLevel): void;
}

/**
 * Log item
 * */
export interface LogItem {
  /**
   * Log level
   * */
  level: LogLevel;

  /**
   * Where, holder
   * */
  where?: string;

  /**
   * Context
   * */
  ctx?: unknown;

  /**
   * Log time
   * */
  now: string;

  /**
   * Message or error
   * */
  message: string | Error;

  /**
   * Params, raw
   * */
  params?: Opt;

  /**
   * Params, flatten
   * */
  paramStr?: string;
}

/**
 * Color Level tuple
 * - 0: bold
 * - 1: regular
 * - 2: light
 * */
export type LocalColorLevel = [boolean, string, string];

/**
 * Color interface
 * */
export interface LocalColorLike {
  /**
   * Bold color
   * */
  bold: string;

  /**
   * Normal color
   * */
  normal: string;

  /**
   * End color
   * */
  end: string;

  /**
   * Param color
   * */
  param: string;

  /**
   * Log levels
   * */
  levels: Record<LogLevel, LocalColorLevel>;
}

/**
 * Log formatter lambda
 *
 * @param {LogItem} item
 * */
export type LogFormatterLambda = (item: LogItem) => void;

/**
 * Log styler lambda
 *
 * @param {LogItem} item
 * */
export type LogStylerLambda = (item: LogItem) => string;

/**
 * Logger instance creator
 * */
export interface LoggerInstanceCtor {
  /**
   * Constructor
   *
   * @param {string} name
   * @return {Logger}
   * */
  new (name: string): Logger;
}

/**
 * Log common interface
 * */
export interface LogCommonLike {
  /**
   * Create new logger with class name
   *
   * @param {string} className - name of class
   * @return {Logger} - logger instance
   * */
  of(className: string): Logger;

  /**
   * Create new logger with class name
   *
   * @param {object} instance - instance
   * @return {Logger} - logger instance
   * */
  of(instance: Obj): Logger;

  /**
   * Create new logger with class
   *
   * @param {function} clazz - class
   * @return {Logger} - logger instance
   * */
  of(clazz: ClassLike | Fnc): Logger;

  /**
   * Set formatter
   *
   * @param {function} fn - lambda for formatter
   * */
  setLogFormatter(fn: LogFormatterLambda): void;

  /**
   * Set deployment styler
   *
   * @param {function} fn - lambda for styler
   * */
  setLogDeploymentStyler(fn: LogStylerLambda): void;

  /**
   * Set local style
   *
   * @param {function} fn - lambda for styler
   * */
  setLogLocalStyler(fn: LogStylerLambda): void;

  /**
   * Set local style
   *
   * @param {function} fn - lambda for styler
   * */
  setContextFinder(fn: ContextFinderLambda): void;

  /**
   * Start to consume log items
   * */
  initConsume(): void;

  /**
   * Emit/trigger to log
   *
   * @param {LogLevel} level
   * @param {string} where
   * @param {any} message
   * @param {Opt} params
   * */
  emitLog(level: LogLevel, where: string, message: any, params?: any | Opt): void;
}

// endregion logger

// region predictor
/**
 * Predictor modes
 * @enum
 * */
export type PredictorMode = "eager" | "lazy" | "failed" | "conflicted";

/**
 * Predictor stages
 * @enum
 * */
export type PredictorStage = "persistent" | "fqn-waiting" | "loading-waiting";

/**
 * Predictor build options
 * */
export interface PredictorBuildOpt {
  /**
   * Anonymous name
   * */
  anonymousName?: string;
}

/**
 * Predictor repository interface
 * */
export interface PredictorRepo<L extends PredictorItem<T>, T> {
  /**
   * Target map
   * - as: <target, item>
   * */
  targets: Map<T, L>;

  /**
   * Full name map
   * - as: <fullName, item>
   * */
  fullNames: Map<string, L>;

  /**
   * Basic name map
   * - as: <basicName, item>
   * */
  basicNames: Map<string, L>;

  /**
   * Alias map
   * - as: <alias, fullName>
   * */
  aliases: Map<string, string>;

  /**
   * Pending fqn map
   * - as: <basicName, item>
   * */
  pendingFqn: Map<string, L>;

  /**
   * Pending lazy map
   * - as: <basicName, item>
   * */
  pendingLazy: Map<string, L>;
}

/**
 * Predictor item
 * */
export interface PredictorItem<T> extends PredictorOpt<T> {
  /**
   * Full name of target (PCK)
   * */
  full?: string;

  /**
   * Lazy mode
   * */
  mode: PredictorMode;

  /**
   * Lazy stage
   * */
  stage: PredictorStage;

  /**
   * Load target
   * */
  load(): Promise<void>;
}

/**
 * Predictor option interface
 * */
export interface PredictorOpt<T> {
  /**
   * Name of target
   * */
  name?: string;

  /**
   * Name of target
   * */
  target?: T;

  /**
   * Lazy target promise
   * */
  lazyTarget?: Promise<T>;

  /**
   * Alias for it
   * */
  aliases?: Array<string>;

  /**
   * Fqn name
   * */
  pck?: string;
}

/**
 * Predictor interface
 * */
export interface PredictorLike<L extends PredictorItem<T>, T, O extends PredictorOpt<T>> {
  /**
   * Define an predictor as eager
   *
   * @param {PredictorOpt} options - options
   * */
  register(options: O): L;

  /**
   * Define an predictor as eager
   *
   * @param {string} pck - package name
   * @param {string} name - name
   * @param {Promise} lazyTarget
   * @param {PredictorOpt?} opt
   * */
  lazy(
    pck: string,
    name: string,
    lazyTarget: Promise<T>,
    opt?: Omit<O, "name" | "target" | "lazyTarget" | "pck">,
  ): L;

  /**
   * Check predictor defined as lazy, by name
   * Note:
   * - Predictor mode will be shifted lazy to eager after loaded
   *
   * @param {string} name - target name
   * @return {boolean}
   * */
  isLazy(name: string): boolean;

  /**
   * Check predictor failed or conflicted, by name
   *
   * @param {string} name - target name
   * @return {boolean}
   * */
  isInvalid(name: string): boolean;

  /**
   * Check predictor failed or conflicted, by name
   *
   * @param {string} name - target name
   * @return {boolean}
   * */
  isFailed(name: string): boolean;

  /**
   * Check predictor failed or conflicted, by name
   *
   * @param {string} name - target name
   * @return {boolean}
   * */
  isConflicted(name: string): boolean;

  /**
   * Check predictor defined as eager, by name
   *
   * @param {string} name - target name
   * @return {boolean}
   * */
  isEager(name: string): boolean;

  /**
   * Check predictor defined or not, by name
   *
   * @param {string} name - target name
   * @return {boolean}
   * */
  has(name: string): boolean;

  /**
   * Get predictor by name
   *
   * @param {string} name - target name
   * @return {PredictorItem}
   * */
  get(name: string): L;

  /**
   * Load lazy predictor by name
   * Note:
   * - Target must be exported as `predictor`
   *
   * @param {string} name - target name
   * @return {Promise<PredictorItem>}
   * @async
   * */
  load(name: string): Promise<L>;
}

// endregion predictor

// region error
/**
 * Leyyo error creator
 * */
export interface LeyyoErrorCtor {
  /**
   * Create without any parameter
   * */
  new (): LeyyoErrorLike;

  /**
   * Create with only message
   *
   * @param {string} message - error message
   * */
  new (message: string): LeyyoErrorLike;

  /**
   * Create with only params
   *
   * @param {Opt} params - error parameters
   * */
  new (params: Opt): LeyyoErrorLike;

  /**
   * Create with message and params
   *
   * @param {string} message - error message
   * @param {Opt} params - error parameters
   * */
  new (message: string, params: Opt): LeyyoErrorLike;
}

/**
 * Developer error creator
 * {@link DeveloperError}
 * */
export interface DeveloperErrorCtor {
  /**
   * Create developer error
   *
   * @param {string} message - error message
   * @param {string} issue - test case
   * @param {string} where - where
   * */
  new (message: string, issue?: string, where?: string): DeveloperErrorLike;
}

/**
 * Error flags
 * */
export type LeyyoErrorTag = "printed" | "sent";

/**
 * Stack line
 * */
export interface ErrorStackLine {
  /**
   * File of error
   * */
  file: string;

  /**
   * Method of error
   * */
  method?: string;

  /**
   * Position of error
   * */
  pos?: string;
}

/**
 * Developer error interface
 * */
export interface DeveloperErrorLike extends Error {
  /**
   * Formatted stack trace
   * */
  stackTrace?: Array<ErrorStackLine>;

  /**
   * Log error
   *
   * @param {Error?} err - optional caused error
   * */
  log(err?: Error): void;
}

/**
 * Error interface
 * */
export interface LeyyoErrorLike extends Error, ShiftSecure<LeyyoErrorSecure> {
  /**
   * Parameters for error
   * */
  params?: Opt;

  /**
   * Formatted stack trace
   * */
  stackTrace?: Array<ErrorStackLine>;

  /**
   * Caused error
   * */
  causedBy?: OneOrMore<Error>;

  /**
   * Bind caused error
   *
   * @param {Error} err
   * @return {LeyyoErrorLike}
   * */
  causes(err: Error): this;

  /**
   * Bind holder class name
   *
   * @param {string} name - name of class
   * @param {string?} pck - package name
   * @return {LeyyoErrorLike}
   * */
  where(name: string, pck?: string): this;

  /**
   * Bind holder instance
   *
   * @param {Obj} instance - this instance
   * @return {LeyyoErrorLike}
   * */
  where(instance: Obj): this;

  /**
   * Bind holder instance
   *
   * @param {function} clazz - class
   * @return {LeyyoErrorLike}
   * */
  where(clazz: ClassLike): this;

  /**
   * Raise or log based on first parameter
   *
   * @param {boolean} isLog
   * @param {Logger?} logger - optional bound logger
   * @param {LogLevel?} level - optional log level, default: warn
   * @throws {LeyyoErrorLike}
   * */
  raiseOrLog(isLog: boolean, logger?: Logger, level?: LogLevel): void;

  /**
   * Alias for {@link logError}
   *
   * @param {Logger?} logger - optional bound logger
   * */
  log(logger?: Logger): void;

  /**
   * Log as `fatal`
   *
   * @param {Logger?} logger - optional bound logger
   * */
  logFatal(logger?: Logger): void;

  /**
   * Log as `error`
   *
   * @param {Logger?} logger - optional bound logger
   * */
  logError(logger?: Logger): void;

  /**
   * Log as `warn`
   *
   * @param {Logger?} logger - optional bound logger
   * */
  logWarn(logger?: Logger): void;

  /**
   * Log as `debug`
   *
   * @param {Logger?} logger - optional bound logger
   * */
  logDebug(logger?: Logger): void;

  /**
   * Log as `info`
   *
   * @param {Logger?} logger - optional bound logger
   * */
  logInfo(logger?: Logger): void;

  /**
   * Log as `trace`
   *
   * @param {Logger?} logger - optional bound logger
   * */
  logTrace(logger?: Logger): void;
}

/**
 * Error secure interface
 * */
export interface LeyyoErrorSecure extends ShiftMain<LeyyoErrorLike> {
  /**
   * Get where
   * @return {string}
   * */
  get $where(): string;

  /**
   * List flags
   *
   * @return {Array<string>} - flags
   * */
  $list<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(): Array<T>;

  /**
   * Append a flag
   *
   * @param {string} key - flag key
   * @return {boolean} - is it appended?
   * */
  $append<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

  /**
   * Remove a flag
   *
   * @param {string} key - flag key
   * @return {boolean} - is it removed?
   * */
  $remove<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

  /**
   * Has a flag?
   *
   * @param {string} key - flag key
   * @return {boolean} - has it?
   * */
  $has<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean;

  /**
   * Copy source properties into target parameters
   *
   * @param {Error} source - source error
   * */
  $copyProperties(source: Error): void;
}

/**
 * Error predictor config
 * */
export interface ErrorItemConfig {
  /**
   * Default error message
   * */
  message?: string;

  /**
   * Will be error emitted?
   * */
  emit?: unknown; // todo

  /**
   * Will be the error decorated for context language?
   * */
  i18n?: unknown; // todo
}

/**
 * Error predictor pool option
 * */
export type ErrorPoolOpt = PredictorOpt<ClassLike> & ErrorItemConfig;

/**
 * Error predictor item
 * */
export type ErrorPoolItem = PredictorItem<ClassLike> & ErrorPoolOpt;

/**
 * Error predictor pool interface
 * */
export interface ErrorPoolLike extends PredictorLike<
  PredictorItem<ClassLike>,
  ClassLike,
  ErrorPoolOpt
> {
  /**
   * Define an error
   *
   * @param {any} clazz
   * @param {PredictorOpt?} opt
   * */
  define(clazz: ClassLike, opt?: Omit<ErrorPoolOpt, "name" | "target" | "lazyTarget">): void;
}
/**
 * Bare omit error without any property
 * */
export type OmitError = Omit<Error, "name" | "message" | "stack">;

/**
 * Error creator
 * */
export interface ErrorCtor extends Fnc {
  /**
   * Constructor
   * */
  new (...args: Array<unknown>): OmitError;
}

/**
 * Error interface
 * */
export interface ErrorObject {
  name: string;
  message: string;
}

/**
 * Error common interface
 * */
export interface ErrorCommonLike {
  /**
   * Config error class
   *
   * @param {ClassLike} clazz - error class
   * @param {ErrorItemConfig} conf - configuration
   * */
  setConfigItem(clazz: ClassLike, conf: ErrorItemConfig): void;

  /**
   * Get config of error class
   *
   * @param {ClassLike} clazz - error class
   * @return {ErrorItemConfig} - configuration
   * */
  getConfigItem(clazz: ClassLike): ErrorItemConfig;

  /**
   * It will be called when an error raised
   * */
  emit(err: Error): void;

  /**
   * Build error stack
   *
   * @param {Error} source
   * @param {boolean?} force
   * */
  buildStack(source: Error, force?: boolean): void;

  /**
   * Transform error as a bare object without name and message
   *
   * @param {Error} err - error instance
   * @param {Opt} existing - existing parameters
   * @return {Opt?} - bare error object
   * */
  toJsonBasic(err: Error, existing?: Opt): Opt;

  /**
   * Transform error as a bare object with name and message
   *
   * @param {Error} err - error instance
   * @param {Opt} existing - existing parameters
   * @return {Opt?} - bare error object
   * */
  toJsonFull(err: Error, existing: Opt): Opt;

  /**
   * Cast a native error to leyyo error
   *
   * @param {Error} e - native error instance
   * @param {Opt?} params - params for error
   * @return {LeyyoErrorLike} - new error instance
   * */
  cast<E extends LeyyoErrorLike>(e: Error, params?: Opt): E;

  /**
   * Cast a native error by given error class
   *
   * @param {function} clazz - new error class
   * @param {Error} e - native error instance
   * @param {Opt?} params - params for error
   * @return {LeyyoErrorLike} - new error instance
   * */
  forcedCast<E extends LeyyoErrorLike>(clazz: ClassLike, e: Error, params?: Opt): E;

  /**
   * Add known package to shorten stacktrace paths
   *
   * @param {string} packageName
   * @param {string} shortName
   * */
  addKnownPackage(packageName: string, shortName: string): void;

  /**
   * Build a standard error text
   *
   * @param {Error} err - error instance
   * @return {string} - error text
   * */
  bareObj(err: Error): ErrorObject;

  /**
   * Build a standard error text
   * - if parts: `<info> [err:error.name] => [error.message]`
   * - else: `[err:error.name] => [error.message]`
   *
   * @param {Error} err - error instance
   * @param {...Array<string|number>} parts - parts for info
   * @return {string} - error text
   * */
  text(err: Error, ...parts: Array<string | number>): string;

  /**
   * Add error statistics with instance
   *
   * @param {Error} error
   * @return {number} - total raised count
   * */
  addStat(error: Error): number;

  /**
   * Add error statistics
   *
   * @param {ErrorCtor} clazz
   * @return {number} - total raised count
   * */
  addStat(clazz: ErrorCtor): number;

  /**
   * Get error statistics with instance
   *
   * @param {Error} error
   * @return {number} - total raised count
   * */
  getStat(error: Error): number;

  /**
   * Get error statistics
   *
   * @param {ErrorCtor} clazz
   * @return {number} - total raised count
   * */
  getStat(clazz: ErrorCtor): number;

  /**
   * Clear statistics
   * */
  clearStats(): void;

  /**
   * List statistics
   *
   * @return {Record} - as {[error-name]: number}
   * */
  listStats(): Record<string, number>;
}

// endregion error

// region enum
/**
 * Enum map
 * */
export type Enum<E extends KeyValue = KeyValue> = { [K in E]: KeyValue };

/**
 * Enum alteration map
 * */
export type EnumAlt<E extends KeyValue = KeyValue> = Rec<E>;

/**
 * Enum predictor config
 * */
export interface EnumItemConfig {
  /**
   * Enum name
   * */
  name?: string;

  /**
   * Will be the error decorated for context language?
   * */
  i18n?: unknown; // todo

  /**
   * Alternative map
   * */
  alt?: EnumAlt;

  /**
   * Aliases
   * */
  aliases?: Array<string>;
}

/**
 * Enum predictor pool options
 * */
export interface EnumPoolOpt extends PredictorOpt<Enum>, EnumItemConfig {
  /**
   * Alternative map path
   * */
  lazyAlt?: Promise<EnumAlt>;
}

/**
 * Enum predictor item
 * */
export type EnumPoolItem = PredictorItem<Enum> & EnumPoolOpt;

/**
 * Enum non-functional members
 * */
export type EnumNonFunctional<T> = T extends Fnc ? never : T;

/**
 * Enum predictor pool interface
 * */
export interface EnumPoolLike extends PredictorLike<PredictorItem<Enum>, Enum, EnumPoolOpt> {
  /**
   * Config enum
   *
   * @param {Enum} enm - enum
   * @param {EnumItemConfig} conf - configuration
   * */
  setConfigItem(enm: Enum, conf: EnumItemConfig): void;

  /**
   * Config enum
   *
   * @param {Enum} enm - enum
   * @return {EnumItemConfig} - configuration
   * */
  getConfigItem(enm: Enum): EnumItemConfig;

  /**
   * Define an enumeration
   *
   * @param {string} pck - package name
   * @param {string} name - enum name
   * @param {Enum} enm
   * @param {PredictorOpt?} opt
   * */
  define(
    pck: string,
    name: string,
    enm: Enum,
    opt?: Omit<EnumPoolOpt, "name" | "target" | "lazyTarget" | "pck">,
  ): void;

  /**
   * Transform to literal
   *
   * @param {Enum} enm - enum
   * @return {ReadonlyArray<EnumNonFunctional<E[keyof E]>>} - literal array
   * */
  toLiteral<E>(enm: E): ReadonlyArray<EnumNonFunctional<E[keyof E]>>;

  /**
   * Merge enums
   *
   * @param {Array<Enum>} maps
   * @return {Enum}
   * */
  merge<N>(...maps: Enum[]): N;
}
// endregion enum

// region literal
/**
 * Literal array
 * */
export type Literal<E extends KeyValue = KeyValue> = Array<E> | ReadonlyArray<E>;

/**
 * Literal alteration map
 * */
export type LiteralAlt<E extends KeyValue = KeyValue> = Rec<E>;

/**
 * Literal predictor config
 * */
export interface LiteralItemConfig {
  /**
   * Literal name
   * */
  name?: string;

  /**
   * Will be the error decorated for context language?
   * */
  i18n?: unknown; // todo

  /**
   * Alternative map
   * */
  alt?: LiteralAlt;

  /**
   * Aliases
   * */
  aliases?: Array<string>;
}

/**
 * Literal predictor pool options
 * */
export interface LiteralPoolOpt extends PredictorOpt<Literal>, LiteralItemConfig {
  /**
   * Alternative map path
   * */
  lazyAlt?: Promise<LiteralAlt>;
}

/**
 * Literal predictor pool item
 * */
export type LiteralPoolItem = PredictorItem<Literal> & LiteralPoolOpt;

/**
 * Literal predictor pool interface
 * */
export interface LiteralPoolLike extends PredictorLike<
  PredictorItem<Literal>,
  Literal,
  LiteralPoolOpt
> {
  /**
   * Config literal
   *
   * @param {Literal} lit - literal
   * @param {LiteralItemConfig} conf - configuration
   * */
  setConfigItem(lit: Literal, conf: LiteralItemConfig): void;

  /**
   * Config literal
   *
   * @param {Literal} lit - literal
   * @return {LiteralItemConfig} - configuration
   * */
  getConfigItem(lit: Literal): LiteralItemConfig;

  /**
   * Define an literal
   *
   * @param {string} pck - package name
   * @param {string} name - literal name
   * @param {Literal} items
   * @param {PredictorOpt?} opt
   * */
  define(
    pck: string,
    name: string,
    items: Literal,
    opt?: Omit<LiteralPoolOpt, "name" | "target" | "lazyTarget" | "pck">,
  ): void;
}

// endregion literal

// region deploy
/**
 * Deploy common interface
 * */
export interface DeployCommonLike {
  /**
   * Wait deploy of a component
   *
   * @param {string} name - name of component
   * @param {function} callback - callback for creator of component, if it completes it, this callback will be called
   * */
  wait(name: string, callback: Fnc): void;

  /**
   * Complete deploy of a component
   * - It should be called by owner of component
   *
   * @param {string} name - name of component
   * @param {Array} values - They will be sent to callback of waiting component, {@link #wait}
   * */
  complete(name: string, ...values: Array<unknown>): void;
}

// endregion deploy

// region event
/**
 * Default event types
 * */
export type EventType = "log" | "error:emit" | "context:set-finder";

/**
 * Event common interface
 * */
export interface EventCommonLike<T extends string> {
  /**
   * Event emitter
   * */
  get emitter(): EventEmitter;

  /**
   * Wait for an event
   *
   * @param {string} event - event name
   * @param {number?} timeoutMs - optional timeout
   * @return {Promise}
   * */
  wait<R = unknown>(event: T, timeoutMs?: number): Promise<R>;

  /**
   * Fork event common with different event types
   *
   * @return {EventCommonLike}
   * */
  fork<F extends string>(): EventCommonLike<T | F>;

  /**
   * Emit (fire) an event
   *
   * @param {string} name - event name
   * @param {...Array} values - They will be used for callback of listener
   * @return {boolean} - message is emitted correctly
   *
   * Note:
   * - If there is not any listener for this event yet, events will be collected
   * */
  emit(name: T, ...values: Array<unknown>): boolean;

  /**
   * Listen an event
   *
   * @param {string} name - event name
   * @param {function} callback - callback for emitted event
   *
   * Note:
   * - If there are previous emitted events, it will listen them immediately (lazy event driven)
   * */
  listen<T extends string = string>(name: EventType | T, callback: Fnc): void;

  /**
   * Deactivate an event
   *
   * Means:
   * - If there is no any listener then;
   * - - emitted messages will be ignored
   * - - collected message will be cleared
   *
   * @param {string} name - event name
   * @return {boolean} - if it is previously activated (default) then true
   * */
  deactivate(name: string): boolean;

  /**
   * Activate an event
   *
   * Means:
   * - If there is no any listener then;
   * - - emitted messages will be collected till listener comes in
   *
   * @param {string} name - event name
   * @return {boolean} - if it is previously deactivated then true
   * */
  activate(name: string): boolean;
}

// endregion event

// region signal
export type SignalCallback<R = unknown> = (v: R) => void;
/**
 * Signal common interface
 *
 * Generics:
 * - K: key type
 * */
export interface SignalCommonLike<K extends string = string> {
  /**
   * Fork signal common with different keys
   *
   * @return {SignalCommonLike}
   * */
  fork<K2 extends string>(): SignalCommonLike<K2>;

  /**
   * Wait async
   *
   * @param {string} key
   * @return {Promise}
   */
  wait<R = unknown>(key: K): Promise<R>;

  /**
   * Call waiting callbacks by key
   */
  done<R = unknown>(key: K, value: R): void;

  /**
   * Check is done?
   *
   * @param {string} key
   * @return {boolean}
   */
  isDone(key: K): boolean;
}

// region lifecycle
/**
 * Lifecycle stages
 * */
export type LifecycleStage =
  | "initialize"
  | "export"
  | "validate"
  | "process"
  | "clear"
  | "ota-before"
  | "ota-after"
  | "kill";

/**
 * Lifecycle initialize interface
 * */
export interface OnInit {
  /**
   * It will be called when `initialize` stage of lifecycle
   * */
  onInit(...args: Arr): void;
}
/**
 * Lifecycle initialize interface
 * */
export interface OnInitAsync {
  /**
   * It will be called when `initialize` stage of lifecycle
   * */
  onInitAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle export interface
 * */
export interface OnExport {
  /**
   * It will be called when `export` stage of lifecycle
   * */
  onExport(...args: Arr): void;
}

/**
 * Lifecycle export interface
 * */
export interface OnExportAsync {
  /**
   * It will be called when `export` stage of lifecycle
   * */
  onExportAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle validate interface
 * */
export interface OnValidate {
  /**
   * It will be called when `validate` stage of lifecycle
   * */
  onValidate(...args: Arr): void;
}

/**
 * Lifecycle validate interface
 * */
export interface OnValidateAsync {
  /**
   * It will be called when `validate` stage of lifecycle
   * */
  onValidateAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle process interface
 * */
export interface OnProcess {
  /**
   * It will be called when `process` stage of lifecycle
   * */
  onProcess(...args: Arr): void;
}

/**
 * Lifecycle process interface
 * */
export interface OnProcessAsync {
  /**
   * It will be called when `process` stage of lifecycle
   * */
  onProcessAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle clear interface
 * */
export interface OnClear {
  /**
   * It will be called when `clear` stage of lifecycle
   * */
  onClear(...args: Arr): void;
}

/**
 * Lifecycle clear interface
 * */
export interface OnClearAsync {
  /**
   * It will be called when `clear` stage of lifecycle
   * */
  onClearAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle ota-before interface
 * */
export interface OnOtaBefore {
  /**
   * It will be called when `ota-before` stage of lifecycle
   * */
  onOtaBefore(...args: Arr): void;
}

/**
 * Lifecycle ota-before interface
 * */
export interface OnOtaBeforeAsync {
  /**
   * It will be called when `ota-before` stage of lifecycle
   * */
  onOtaBeforeAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle ota-after interface
 * */
export interface OnOtaAfter {
  /**
   * It will be called when `ota-after` stage of lifecycle
   * */
  onOtaAfter(...args: Arr): void;
}

/**
 * Lifecycle ota-after interface
 * */
export interface OnOtaAfterAsync {
  /**
   * It will be called when `ota-after` stage of lifecycle
   * */
  onOtaAfterAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle kill interface
 * */
export interface OnKill {
  /**
   * It will be called when `kill` stage of lifecycle
   * */
  onKill(...args: Arr): void;
}

/**
 * Lifecycle kill interface
 * */
export interface OnKillAsync {
  /**
   * It will be called when `kill` stage of lifecycle
   * */
  onKillAsync(...args: Arr): Promise<void>;
}

/**
 * Lifecycle tuple as [name, callbacks]
 * */
export type LifecycleTuple = [string, Array<Fnc>];

/**
 * Lifecycle order lambda by stage
 *
 * @param {Map<string, Array<Fnc>>} map - as Map<name, callbacks>
 * @return {Array<LifecycleTuple>}
 * */
export type LifecycleSortLambda = (map: Map<string, Array<Fnc>>) => Array<LifecycleTuple>;

/**
 * Lifecycle common interface
 * */
export interface LifecycleCommonLike {
  /**
   * Add lifecycle by stage
   *
   * @param {LifecycleStage} stage - stage
   * @param {string} name - your callback name
   * @param {function} callback - it will be called on {@link #runStage}
   * */
  addStage(stage: LifecycleStage, name: string, callback: Fnc): void;

  /**
   * Run lifecycle by stage
   *
   * @param {LifecycleStage} stage
   * @param {...Array} params
   * @return {number} - called callbacks number
   * */
  runStage(stage: LifecycleStage, ...params: Array<unknown>): Promise<number>;

  /**
   * Set lifecycle sort lambda by stage
   *
   * @param {LifecycleStage} stage
   * @param {LifecycleSortLambda} lambda - function that sorts map items
   * */
  setOrderLambda(stage: LifecycleStage, lambda: LifecycleSortLambda): void;
}

// endregion lifecycle

// region repo
/**
 * Repository types
 * @enum
 * */
export type RepoDataType = "array" | "list" | "map" | "set";

/**
 * Repository common interface
 * */
export interface RepoCommonLike {
  // region general

  /**
   * Get code by array value
   *
   * @param {Array} arr - array data
   * @return {symbol}
   * */
  getCode<K1 = unknown>(arr: Array<K1>): symbol;

  /**
   * Get code by list value
   *
   * @param {ListLike} list - list data
   * @return {symbol}
   * */
  getCode<K1 = unknown>(list: ListLike<K1>): symbol;

  /**
   * Get code by map value
   *
   * @param {Map} map - map data
   * @return {symbol}
   * */
  getCode<K1 = unknown, K2 = unknown>(map: Map<K1, K2>): symbol;

  /**
   * Get code by set value
   *
   * @param {Set} set - set data
   * @return {symbol}
   * */
  getCode<K1 = unknown>(set: Set<K1>): symbol;

  /**
   * Get type by code
   *
   * @param {symbol} code - key of collection
   * @return {RepoDataType}
   * */
  getType(code: symbol): RepoDataType;

  /**
   * Get type by array value
   *
   * @param {Array} arr - array data
   * @return {RepoDataType}
   * */
  getType<K1 = unknown>(arr: Array<K1>): RepoDataType;

  /**
   * Get type by list value
   *
   * @param {ListLike} list - list data
   * @return {RepoDataType}
   * */
  getType<K1 = unknown>(list: ListLike<K1>): RepoDataType;

  /**
   * Get type by map value
   *
   * @param {Map} map - map data
   * @return {RepoDataType}
   * */
  getType<K1 = unknown, K2 = unknown>(map: Map<K1, K2>): RepoDataType;

  /**
   * Get type by set value
   *
   * @param {Set} set - set data
   * @return {RepoDataType}
   * */
  getType<K1 = unknown>(set: Set<K1>): RepoDataType;

  /**
   * Remove collection by given key
   *
   * @param {symbol} code - key of collection
   * @return {number}
   *
   * Return possibilities:
   *  - `-1`: key does not exist or code is not valid symbol
   *  - `>= 0`: length of removed items in collection
   * */
  remove(code: symbol): number;
  /**
   * Remove collection by array value
   *
   * @param {Array} arr - array data
   * @return {RepoDataType}
   * */
  remove<K1 = unknown>(arr: Array<K1>): number;

  /**
   * Remove collection by list value
   *
   * @param {ListLike} list - list data
   * @return {RepoDataType}
   * */
  remove<K1 = unknown>(list: ListLike<K1>): number;

  /**
   * Remove collection by map value
   *
   * @param {Map} map - map data
   * @return {RepoDataType}
   * */
  remove<K1 = unknown, K2 = unknown>(map: Map<K1, K2>): number;

  /**
   * Remove collection by set value
   *
   * @param {Set} set - set data
   * @return {RepoDataType}
   * */
  remove<K1 = unknown>(set: Set<K1>): number;

  /**
   * Clear collection by given code
   *
   * @param {symbol} code - key of collection
   * @return {number}
   *
   * Return possibilities:
   *  - `-1`: key does not exist or code is not valid symbol
   *  - `>= 0`: length of cleared items in collection
   * */
  clear(code: symbol): number;

  /**
   * Clear volatile collections
   *
   * @return {number} - deleted collections, not data size
   * */
  clearVolatile(): number;

  /**
   * List all collection keys (codes)
   *
   * @return {Array<symbol>}
   * */
  keys(): Array<symbol>;

  /**
   * Return collection sizes with stringified keys
   *
   * @return {Record} - as {key: length of collection}
   *
   * Note:
   * - if stringified symbol is duplicated, add index postfix with `#` symbol
   * */
  sizes(): Record<string, number>;
  // endregion general

  // region new-collection
  /**
   * Create new array
   *
   * @param {string} name - name of collection
   * @param {boolean} volatile - if yes: it will be removed after lifecycle run
   * @return {Array<any>}
   * */
  newArray<V>(name: string, volatile?: boolean): Array<V>;

  /**
   * Create new list
   *
   * @param {string} name - name of collection
   * @param {boolean} volatile - if yes: it will be removed after lifecycle run
   * @return {ListLike<any>}
   * */
  newList<V>(name: string, volatile?: boolean): ListLike<V>;

  /**
   * Create new map
   *
   * @param {string} name - name of collection
   * @param {boolean} volatile - if yes: it will be removed after lifecycle run
   * @return {Map<any, any>}
   * */
  newMap<K, V>(name: string, volatile?: boolean): Map<K, V>;

  /**
   * Create new set
   *
   * @param {string} name - name of collection
   * @param {boolean} volatile - if yes: it will be removed after lifecycle run
   * @return {Set<any>}
   * */
  newSet<V>(name: string, volatile?: boolean): Set<V>;
  // endregion new-collection

  /**
   * Initialize
   * */
  init(): void;
}

// endregion repo

// region context
/**
 * Context finder lambda
 * @param {Array<any>} p
 * */
export type ContextFinderLambda = <T = unknown>(...p: Array<unknown>) => T;
// endregion context

// region fqn
/**
 * FQN target
 * */
export type FqnTarget = ClassLike | Fnc | Obj | Enum | Literal;

/**
 * FQN set lambda
 *
 * @param {string} full
 * */
export type FqnOnSetLambda = (full: string) => void;
// endregion fqn

// region predictor
/**
 * Predictor item lambda
 *
 * @return {PredictorItem}
 * */
export type PredictorItemLambda<T> = () => PredictorItem<T>;

/**
 * Predictor dependency lambda
 *
 * @return {Promise<PredictorViewerLike>}
 * */
export type PredictorDependencyLambda = () => Promise<PredictorViewerLike>;

/**
 * Predictor creator
 * */
export interface PredictorDefinerCtor {
  /**
   * Constructor
   *
   * @param {string} pck
   * @return {PredictorDefinerLike}
   * */
  new (pck: string): PredictorDefinerLike;
}

/**
 * Foretell definer interface, it is used during definition
 * */
export interface PredictorDefinerLike {
  /**
   * Add dependency
   *
   * @param {Array<PredictorViewerLike>} dependencies - dependencies (as variadic)
   * @return {PredictorDefinerLike}
   * */
  dependency(
    ...dependencies: Array<PredictorDependencyLambda | PredictorDefinerLike | PredictorViewerLike>
  ): PredictorDefinerLike;

  /**
   * Add member
   *
   * @param {Array<PredictorItemLambda>} members - imported predictor item
   * @return {PredictorDefinerLike}
   * */
  add<T>(...members: Array<PredictorItemLambda<T>>): PredictorDefinerLike;

  /**
   * Complete predictor, shift from definer to viewer
   *
   * @return {PredictorViewerLike}
   * */
  end(): PredictorViewerLike;
}

/**
 * Foretell viewer interface, it is used after definition
 * */
export interface PredictorViewerLike {
  /**
   * Package name
   *
   * @return {string}
   * */
  get pck(): string;

  /**
   * Is closed?
   *
   * @return {boolean}
   * */
  get isClosed(): boolean;

  /**
   * Is loaded?
   *
   * @return {boolean}
   * */
  get isLoaded(): boolean;

  /**
   * Load items
   *
   * @return {Array<number>}
   * */
  load(): Promise<LazyLoadTuple>;

  /**
   * loaded items
   *
   * @return {Array<PredictorItem<unknown>>}
   * */
  get items(): Array<PredictorItem<unknown>>;

  /**
   * Dependencies
   *
   * @return {Array<PredictorViewerLike>}
   * */
  dependencies(): Array<PredictorViewerLike | PredictorDependencyLambda>;

  /**
   * Members
   *
   * @return {Array<PredictorItemLambda>}
   * */
  members(): Array<PredictorItemLambda<unknown>>;
}
// endregion predictor

// region lazy
/**
 * Lazy load tuple
 * as: [loaded, total]
 * */
export type LazyLoadTuple = [number, number];

/**
 * Lazy possible types
 * */
export type LazyItem = ClassLike | Fnc | Enum | Literal | Obj;

/**
 * Lazy item lambda
 * @return {Promise<LazyItem>}
 * */
export type LazyItemLambda = () => Promise<LazyItem>;

/**
 * Lazy dependency lambda
 * @return {Promise<LazyViewerLike>}
 * */
export type LazyDependencyLambda = () => Promise<LazyViewerLike>;

/**
 * Lazy definer creator
 * */
export interface LazyDefinerCtor {
  /**
   * Constructor
   *
   * @param {string} pck
   * @return {LazyDefinerLike}
   * */
  new (pck: string): LazyDefinerLike;
}

/**
 * Lazy definer interface, it is used during definition
 * */
export interface LazyDefinerLike {
  /**
   * Add dependency
   *
   * @param {Array<LazyViewerLike>} dependencies - dependencies (as variadic)
   * @return {LazyDefinerLike}
   * */
  dependency(
    ...dependencies: Array<LazyDependencyLambda | LazyDefinerLike | LazyViewerLike>
  ): LazyDefinerLike;

  /**
   * Add member
   *
   * @param {Array<Promise<LazyItem>>} members - imported lazy members
   * @return {LazyDefinerLike}
   * */
  add(...members: Array<LazyItemLambda>): LazyDefinerLike;

  /**
   * Complete lazy
   *
   * @return {LazyViewerLike}
   * */
  end(): LazyViewerLike;
}

/**
 * Lazy viewer interface, it is used after definition
 * */
export interface LazyViewerLike {
  /**
   * Package name
   *
   * @return {string}
   * */
  get pck(): string;

  /**
   * Is closed?
   *
   * @return {boolean}
   * */
  get isClosed(): boolean;

  /**
   * Is loaded?
   *
   * @return {boolean}
   * */
  get isLoaded(): boolean;

  /**
   * loaded items
   *
   * @return {Array<LazyItem>}
   * */
  get items(): Array<LazyItem>;

  /**
   * Load items
   *
   * @return {Array<LazyItem>}
   * */
  load(): Promise<LazyLoadTuple>;

  /**
   * Dependencies
   *
   * @return {Array<LazyViewerLike|LazyDependencyLambda>}
   * */
  dependencies(): Array<LazyViewerLike | LazyDependencyLambda>;

  /**
   * Members
   *
   * @return {Array<LazyItem>}
   * */
  members(): Array<LazyItemLambda>;
}

// endregion lazy

// region option
/**
 * Option reasons
 *
 * @enum
 * */
export type OptReason =
  | "invalid"
  | "unexpected"
  | "not:allowed"
  | "not:found"
  | "duplicated"
  | "empty"
  | "conflicted";

/**
 * Option interface
 * */
export interface Opt<R extends string = string> extends Obj {
  /**
   * Issue
   * */
  issue?: SetOrMore<OptReason | R | string>;

  /**
   * Message
   * */
  message?: SetOrMore<string>;

  /**
   * Field
   * */
  field?: string;

  /**
   * Params
   * */
  param?: SetOrMore<unknown>;

  /**
   * Where
   * */
  where?: SetOrMore<string>;

  /**
   * Value
   * */
  value?: SetOrMore<unknown>;

  /**
   * Expected types
   * */
  expected?: SetOrMore<ExtendedType | string> | OneOrMore<ExtendedType | string>;

  /**
   * Type
   * */
  type?: SetOrMore<ExtendedType | string>;

  /**
   * Method
   * */
  method?: SetOrMore<string>;

  /**
   * Case
   * */
  case?: SetOrMore<unknown>;

  /**
   * Description
   * */
  desc?: SetOrMore<HasDescription | string>;

  /**
   * Error
   * */
  error?: SetOrMore<OmitError>;

  /**
   * Assert
   * */
  assert?: SetOrMore<string>;

  [k: string]: unknown;
}

/**
 * Options lambda
 * @return {Opt}
 * */
export type OptFn<O extends Opt = Opt> = () => O;

/**
 * Options any
 * */
export type OptAny<O extends Opt = Opt> = O | OptFn<O>;
// endregion option

// region exporter
/**
 * Exporter data
 * as <component, value>
 * */
export type ExporterData = Record<string, ExporterValue>;

/**
 * Exporter value
 * as <field, value>
 * */
export type ExporterValue = Record<string, unknown>;

/**
 * Exporter depot interface
 * */
export interface ExporterDepot {
  /**
   * Add info into exporter
   *
   * @param {string} name - component
   * @param {ExporterValue} value
   * */
  add(name: string, value: ExporterValue): void;
}

// endregion exporter

// region config
/**
 * Config interface
 * */
export interface LeyyoConfig {
  [pck: string]: Record<string, unknown>;
}
// endregion config

// region leyyo
/**
 * Leyyo interface
 * */
export interface LeyyoLike {
  // region classes
  /**
   * Developer error class
   * */
  get developerError(): DeveloperErrorCtor;

  /**
   * Leyyo error class
   * */
  get leyyoError(): LeyyoErrorCtor;

  /**
   * Logger instance class
   * */
  get loggerInstance(): LoggerInstanceCtor;

  /**
   * Predictor instance class
   * */
  get predictorDefiner(): PredictorDefinerCtor;

  /**
   * Lazy instance class
   * */
  get lazyDefiner(): LazyDefinerCtor;
  // region classes

  // region instances
  /**
   * Deploy common instance
   * */
  get deployCommon(): DeployCommonLike;

  /**
   * Enum pool instance
   * */
  get enumPool(): EnumPoolLike;

  /**
   * Error common instance
   * */
  get errorCommon(): ErrorCommonLike;

  /**
   * Error pool instance
   * */
  get errorPool(): ErrorPoolLike;

  /**
   * Event common instance
   * */
  get eventCommon(): EventCommonLike<EventType>;

  /**
   * Lifecycle common instance
   * */
  get lifecycleCommon(): LifecycleCommonLike;

  /**
   * Literal pool instance
   * */
  get literalPool(): LiteralPoolLike;

  /**
   * Log common instance
   * */
  get logCommon(): LogCommonLike;

  /**
   * Default logger instance
   * */
  get logger(): Logger;

  /**
   * Repo common instance
   * */
  get repoCommon(): RepoCommonLike;

  /**
   * Signal common instance
   * */
  get signalCommon(): SignalCommonLike;
  // endregion instances
}
// endregion leyyo

// region entity
/**
 * Entity interface
 *
 * Generics:
 * - 0-`I`: type of id
 * - 1-`N`: type of name
 * - 2-`T`: type of time
 * */
export interface Entity<
  I extends IdLike = IdLike,
  N extends CanBeI18N = NameLike,
  T extends IsoDatetime | TimeLong = IsoDatetime | TimeLong,
> extends IdDocLike<I> {
  /**
   * Name
   * */
  name?: N;

  /**
   * Created at
   * */
  createdAt?: T;

  /**
   * Created by
   * */
  createdBy?: UuidLike;

  /**
   * Updated at
   * */
  updatedAt?: T;

  /**
   * Updated by
   * */
  updatedBy?: UuidLike;

  /**
   * Trash id if it's trashed
   * */
  _trashId?: UuidLike;

  /**
   * Revision, update count
   * */
  _revision?: number;

  /**
   * Release
   * */
  _release?: number;

  /**
   * search keywords
   * */
  _search?: SearchDoc;

  /**
   * alpha keywords
   * */
  _alpha?: KeywordLike[];

  /**
   * Irregular fields
   * */
  _irregular?: FieldNameLike[];
}

// noinspection JSUnusedGlobalSymbols
/**
 * I18n based entity
 *
 * Generics:
 * - 0-`I`: type of id
 * - 1-`T`: type of time
 * */
export type EntityI18n<
  I extends IdLike = IdLike,
  T extends IsoDatetime | TimeLong = IsoDatetime | TimeLong,
> = Entity<I, I18nBase, T>;

// noinspection JSUnusedGlobalSymbols
/**
 * Text based entity (name is plain)
 *
 * Generics:
 * - 0-`I`: type of id
 * - 1-`T`: type of time
 * */
export type EntityText<
  I extends IdLike = IdLike,
  T extends IsoDatetime | TimeLong = IsoDatetime | TimeLong,
> = Entity<I, string, T>;

// noinspection JSUnusedGlobalSymbols
/**
 * Pair interface
 *
 * Generics:
 * - 0-`I`: type of id
 * */
export interface Pair<I extends IdLike = IdLike> extends IdDocLike<I> {
  /**
   * Name
   * */
  name?: string;
}

/**
 * Urn item type (each member of urn)
 *
 * One of:
 * - string
 * - number
 * - Date
 * - bigint
 * */
export type UrnItem = string | number | Date | bigint;

// noinspection JSUnusedGlobalSymbols
/**
 * Urn tuple, it contains urn item members
 * - Min length should be 1
 * */
export type UrnTuple = [UrnItem, ...UrnItem[]];

/**
 * Urn doc interface
 * */
export type UrnDocLike = {
  [key: FieldNameLike]: UrnItem;
};

// noinspection JSUnusedGlobalSymbols
/**
 * default urn doc interface
 * */
export type UrnDef<I extends IdLike = IdLike> = IdDocLike<I> & UrnDocLike;

/**
 * Id doc interface, means that each interfaces has id and urn field
 * */
export interface IdDocLike<I extends IdLike = IdLike> {
  /**
   * Id
   * */
  id?: I;

  /**
   * Urn
   * */
  urn?: UrnLike;
}

// noinspection JSUnusedGlobalSymbols
/**
 * View interface for presentation layer
 * */
export type View<I extends IdLike = IdLike> = IdDocLike<I>;

// noinspection JSUnusedGlobalSymbols
/**
 * Portion interface for relation layer
 * */
export type Portion<I extends IdLike = IdLike> = IdDocLike<I>;

// noinspection JSUnusedGlobalSymbols
/**
 * Default dimensions with starting pair, view and portion
 *
 * - You can extend this
 * */
export type DefDims = "pair" | "view" | "portion";

/**
 * I18n doc interface
 *
 * - It is a map with language keys and values
 * */
export type I18nBase<L extends LangLike = LangLike, V = string> = {
  [lang in L]: V;
};

/**
 * Can be I18n interface, means that value can be plain (text) or i18n
 * */
export type CanBeI18N<L extends LangLike = LangLike, V = string> = string | I18nBase<L, V>;

/**
 * Search doc interface
 * */
export type SearchDoc<L extends LangLike = LangLike> = {
  [lang in L]: SearchItem;
};

/**
 * Search item interface
 * */
export type SearchItem<L extends string = DefSearchLevel> = {
  [level in L]?: KeywordLike[];
};

/**
 * Search levels
 * */
export type DefSearchLevel = "high" | "mid" | "low";
// endregion entity

// region enum-lit
/**
 * Enum raw interface
 * */
export interface EnumLitRaw {
  /**
   * Name
   * */
  n?: string;
}
/**
 * Enum  handler interface
 *
 * Generics:
 * - 0-E: enum
 * - 1-A: raw
 * - 2-P: pair
 * - 3-V: view
 * */
export interface EnumLitHandlerLike<
  E extends KeyValue,
  A extends EnumLitRaw,
  P extends Pair<E>,
  V extends View<E>,
> {
  /**
   * Return all codes
   *
   * @type {Array<KeyValue>}
   * */
  get codes(): ReadonlyArray<E>;

  /**
   * Has given a code?
   *
   * @param {KeyValue} code
   * @return {boolean} - exists or not
   * */
  has(code: E): boolean;

  /**
   * Return raw for given code
   * - If it does not exist then returns undefined
   *
   * @param {KeyValue} code - code
   * @return {EnumLitRaw}
   * */
  raw(code: E): A;

  /**
   * Return name for given code
   *
   * @param {KeyValue} code - code
   * @return {string} - name
   * */
  name(code: E): string;

  /**
   * Return pair for given code
   *
   * @param {KeyValue} code - code
   * @return {Pair}
   * */
  pair(code: E): P;

  /**
   * Return view for given code
   *
   * @param {KeyValue} code - code
   * @return {View}
   * */
  view(code: E): V;

  /**
   * Return selected pairs for given codes
   *
   * @param {...KeyValue} codes - codes
   * @return {Array<Pair>}
   * */
  selectedPairs(...codes: Array<E>): Array<P>;

  /**
   * Return all pairs
   *
   * @return {Array<Pair>}
   * */
  allPairs(): Array<P>;
}
// endregion enum-lit

// region dont-use
/*

// export type StrObject<T> = {
//     [K in keyof T ]: K extends string ? K : never;
// };
// export type StrKey<T> = keyof StrObject<T>;

interface _BaseFunc {
    readonly name?: string;
    readonly length?: number;
    bind(thisArg: unknown, ...args: Array<unknown>): unknown;

    apply(thisArg: unknown, args: Array<unknown>): unknown;

    call(thisArg: unknown, ...args: Array<unknown>): unknown;
}

interface _SyncFnc<R> extends _BaseFunc {
    (...args: Array<unknown>): R;
}
interface _AsyncFnc<R> extends _BaseFunc {
    (...args: Array<unknown>): Promise<R>;
}

// export type ClassOrName = ClassLike | string;
// export type FuncOrName = Function | string;
// export type ClassOrFuncOrName = ClassLike | Function | string;
// export type ClassLike<T = {}> = (_BaseFunc & _Type<T>) | _SyncFnc<T>;
// export type AnyFnc<R = unknown> = Fnc<R> | Async<R>;

*/
// endregion dont-use
