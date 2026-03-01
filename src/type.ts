// region basic
import { List } from "./base/index.js";

export type BasicType =
  | "undefined"
  | "string"
  | "object"
  | "number"
  | "boolean"
  | "function"
  | "symbol"
  | "bigint";
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
export type KeyValue = string | number;
export type AnyKey = string | number | symbol;
export type HttpStatus = number;
export type LangLike = string;
export type NameLike = string;
export type KeywordLike = string;
export type FieldNameLike = string;
export type KeyLike = string | number;
export type IdLike = string | number;
export type IntegerLike = number;
export type FloatLike = number;
export type AlphaLike = string; // alphaType
export type SlugLike = string;
export type TextLike = string; // trimmed string
export type DigitLike = string; // digitType, 0-9
export type TitleLike = string; //Single-line clear-text (no html)
export type DescriptionLike = string; //Multi-line clear-text (no html)
export type RichTextLike = string; // multi-line rich text with html tags
export type UuidLike = string;
export type HostLike = string;
export type UriLike = string;
export type UrlLike = string;
export type EmailLike = string;
export type FolderLike = string;
export type PhoneLike = string;
export type UrnLike = string;
export type HashText = string;
export type EncryptedText = string;
export type Timestamp = number;
export type TimeLong = Timestamp;
export type TtlMsec = number;
export type TtlLong = TtlMsec;
export type EpochTime = number;
export type TimeShort = EpochTime;
export type TtlSecond = number;
export type TtlShort = TtlSecond;
export type IsoDatetime = string; // yyyy-mm-ddThh:mm:ii.eeeZ
export type IsoDate = string; // yyyy-mm-dd
export type IsoTime = string; // hh:mm:ii.eeeZ
// endregion alias

// region function
export type Fnc<R = unknown> = ((...args: Arr) => R) & Function;
export type Async<R = unknown> = ((...args: Arr) => Promise<R>) & AsyncGeneratorFunction;

export interface Abstract<T = {}> extends Function {
  prototype: T;
  readonly name: string;
  readonly length: number;

  bind(thisArg: unknown, ...args: Arr): unknown;

  apply(thisArg: unknown, args: Arr): unknown;

  call(thisArg: unknown, ...args: Arr): unknown;
}

export interface ClassLike<T = {}> extends Abstract<T> {
  new (...args: Arr): T;
}

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
export interface Describable {
  description: string;
}

export interface Nameable {
  name: string;
}

export interface HasId {
  id?: IdLike;
}
export type Obj = object & {};
export type Arr<T = unknown> = Array<T>;
export type Rec<T = unknown> = Record<KeyValue, T>;

export type TypeOfMethod<T, M extends keyof T> = T[M] extends Function ? T[M] : never;
export type TypeOfFnc<F extends Fnc> = F extends (...args: Arr) => infer R ? R : never;
export type TypeOfAsync<F extends Async> = TypeOfPromise<TypeOfFnc<F>>;
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

export type KeyOf<T> = keyof T;
export type Keys<T> = Array<keyof T>;
export type ValueOf<T> = T[KeyOf<T>];
export type Values<T> = Array<T[KeyOf<T>]>;
export type OneOrMore<T> = T | Array<T>;
export type SetOrMore<T> = T | Set<T>;

export type IgnoreFieldsByType<T, I> = {
  [K in keyof T]: T[K] extends I ? K : never;
}[keyof T];
export type ReplaceType<T, O, N> = {
  [P in keyof T]: T[P] extends O ? N : T[P];
};
export type SameType<A, T> = {
  [K in keyof A]: T;
};

export type PickByType<T, I> = {
  [K in keyof T]: T[K] extends I ? K : never;
};
export type PickKeyByType<T, I> = PickByType<T, I>[keyof T];

export type OmitByType<T, I> = {
  [K in keyof T]: T[K] extends I ? never : K;
};
export type OmitKeysByType<T, I> = OmitByType<T, I>[keyof T];
export type ValueOrCallback<T> = T | ValueCallback<T> | ValueCallbackAsync<T>;
export type ValueCallback<T> = () => T;
export type ValueCallbackAsync<T> = () => Promise<T>;

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

/**
 * Useful interface which provides initialization state for instances
 * */
export interface InitLike {
  /**
   * Initializes the instance
   * */
  $init(...args: Arr): void;
}

// endregion shift

// region json
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
export type LogLevel = "debug" | "trace" | "info" | "warn" | "error" | "fatal";
export interface Logger extends ShiftSecure<LoggerSecure> {
  debug(message: string, params?: any | Opt): void;

  debug(error: Error, params?: any | Opt): void;

  debug(whatever: any, params?: any | Opt): void;

  trace(message: string, params?: any | Opt): void;

  trace(error: Error, params?: any | Opt): void;

  trace(whatever: any, params?: any | Opt): void;

  info(message: string, params?: any | Opt): void;

  info(error: Error, params?: any | Opt): void;

  info(whatever: any, params?: any | Opt): void;

  warn(message: string, params?: any | Opt): void;

  warn(error: Error, params?: any | Opt): void;

  warn(whatever: any, params?: any | Opt): void;

  error(message: string, params?: any | Opt): void;

  error(error: Error, params?: any | Opt): void;

  error(whatever: any, params?: any | Opt): void;

  fatal(message: string, params?: any | Opt): void;

  fatal(error: Error, params?: any | Opt): void;

  fatal(whatever: any, params?: any | Opt): void;
}

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

export interface LogItem {
  level: LogLevel;
  where?: string;
  ctx?: unknown;
  now: string;
  message: string | Error;
  params?: Opt;
  paramStr?: string;
}

export type LocalColorLevel = [boolean, string, string]; // bold, regular, light
export interface LocalColorLike {
  bold: string;
  normal: string;
  end: string;
  param: string;
  levels: Record<LogLevel, LocalColorLevel>;
}

export type LogFormatterLambda = (item: LogItem) => void;
export type LogStylerLambda = (item: LogItem) => string;

export interface LoggerInstanceCtor {
  new (name: string): Logger;
}

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

  initConsume(): void;

  emitLog(level: LogLevel, where: string, message: any, params?: any | Opt): void;
}

// endregion logger

// region predictor
export type PredictorMode = "eager" | "lazy" | "failed" | "conflicted";
export type PredictorStage = "persistent" | "fqn-waiting" | "loading-waiting";

export interface PredictorBuildOpt {
  anonymousName?: string;
}

export interface PredictorRepo<L extends PredictorItem<T>, T> {
  targets: Map<T, L>; // target, item
  fullNames: Map<string, L>; // fullName, item
  basicNames: Map<string, L>; // basicName, item
  aliases: Map<string, string>; // alias, fullName
  pendingFqn: Map<string, L>; // basicName, item
  pendingLazy: Map<string, L>; // basicName, item
}

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

  load(): Promise<void>;
}

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
 * {@link LeyyoError}
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

export interface LeyyoErrorSecure extends ShiftMain<LeyyoErrorLike> {
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

export type ErrorPoolOpt = PredictorOpt<ClassLike> & ErrorItemConfig;

export type ErrorPoolItem = PredictorItem<ClassLike> & ErrorPoolOpt;

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
export interface ErrorCtor extends Fnc {
  new (...args: Array<unknown>): OmitError;
}

export interface ErrorObject {
  name: string;
  message: string;
}

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

  /** @inheritDoc */
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
export type Enum<E extends KeyValue = KeyValue> = { [K in E]: KeyValue };
export type EnumAlt<E extends KeyValue = KeyValue> = Rec<E>;

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
export interface EnumPoolOpt extends PredictorOpt<Enum>, EnumItemConfig {
  /**
   * Alternative map path
   * */
  lazyAlt?: Promise<EnumAlt>;
}

export type EnumPoolItem = PredictorItem<Enum> & EnumPoolOpt;
export type EnumNonFunctional<T> = T extends Fnc ? never : T;

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

  merge<N>(...maps: Enum[]): N;
}
// endregion enum

// region literal
export type Literal<E extends KeyValue = KeyValue> = Array<E> | ReadonlyArray<E>;
export type LiteralAlt<E extends KeyValue = KeyValue> = Rec<E>;
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

export interface LiteralPoolOpt extends PredictorOpt<Literal>, LiteralItemConfig {
  /**
   * Alternative map path
   * */
  lazyAlt?: Promise<LiteralAlt>;
}

export type LiteralPoolItem = PredictorItem<Literal> & LiteralPoolOpt;

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

// region lifecycle
/**
 * Lifecycle stages
 * */
export type LifecycleStage =
  | "initialize"
  | "print"
  | "validate"
  | "process"
  | "clear"
  | "ota-before"
  | "ota-after"
  | "kill";

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
export type RepoDataType = "array" | "list" | "map" | "set";

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

  init(): void;
}

// endregion repo

// region context
export type ContextFinderLambda = <T = unknown>(...p: Array<unknown>) => T;
// endregion context

// region fqn
export type FqnTarget = ClassLike | Fnc | Obj | Enum | Literal;
export type FqnOnSetLambda = (full: string) => void;
// endregion fqn

// region predictor
export type PredictorItemLambda<T> = () => PredictorItem<T>;
export type PredictorDependencyLambda = () => Promise<PredictorViewerLike>;
export interface PredictorDefinerCtor {
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
export type LazyLoadTuple = [number, number];
export type LazyItem = ClassLike | Fnc | Enum | Literal | Obj;
export type LazyItemLambda = () => Promise<LazyItem>;
export type LazyDependencyLambda = () => Promise<LazyViewerLike>;
export interface LazyDefinerCtor {
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

// region loader
export type LoaderLike = Array<LoaderItem>;
export type LeyyoStampLambda = () => LoaderItem;
export type LeyyoStampEmpty = () => symbol;
export type LoaderItem =
  | ClassLike
  | Fnc
  | Enum
  | Literal
  | Obj
  | LeyyoStampLambda
  | LeyyoStampEmpty
  | LoaderLike;
// endregion loader

// region option
export type OptReason =
  | "invalid"
  | "unexpected"
  | "not:allowed"
  | "not:found"
  | "duplicated"
  | "empty"
  | "conflicted";

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
  error?: SetOrMore<{ name: string; message: string }>;
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

// region config
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

export type SearchDoc<L extends LangLike = LangLike> = {
  [lang in L]: SearchItem;
};

export type SearchItem<L extends string = DefSearchLevel> = {
  [level in L]?: KeywordLike[];
};
export type DefSearchLevel = "high" | "mid" | "low";
// endregion entity

// region enum-lit
export interface EnumLitRaw {
  n?: string;
}
/**
 * Language handler interface
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
