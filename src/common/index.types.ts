import {ClassLike, Dict, Fnc, KeyValue, Obj, ShiftMain, ShiftSecure} from "../base";
import {LogLevel} from "../enum";
import {LeyyoErrorLike} from "../error";
import {List} from "../class";
import {Opt} from "../function";

// region inert
export type InertMode = 'eager' | 'lazy' | 'failed' | 'conflicted';
export type InertStage = 'persistent' | 'fqn-waiting' | 'loading-waiting';

export interface InertBuildOpt {
    anonymousName?: string;
}

export interface InertRepo<L extends InertItem<T>, T> {
    uniqueLoaded: Set<T>; // targets
    fullNames: Map<string, L>; // fullName, item
    basicNames: Map<string, L>; // basicName, item
    aliases: Map<string, string>; // alias, fullName
    pendingFqn: Map<string, L>; // basicName, item
    pendingLazy: Map<string, L>; // basicName, item
}

export interface InertItem<T> extends InertOpt<T> {
    /**
     * Full name of target (FQN)
     * */
    full?: string;

    /**
     * Lazy mode
     * */
    mode: InertMode;

    /**
     * Lazy stage
     * */
    stage: InertStage;
}

export interface InertOpt<T> {
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
    fqn?: string;
}

export interface InertLike<L extends InertItem<T>, T, O extends InertOpt<T>> {

    /**
     * Define an inert as eager
     *
     * @param {InertOpt} options - options
     * */
    register(options: O): void;

    /**
     * Check inert defined as lazy, by name
     * Note:
     * - Inert mode will be shifted lazy to eager after loaded
     *
     * @param {string} name - target name
     * @return {boolean}
     * */
    isLazy(name: string): boolean;

    /**
     * Check inert failed or conflicted, by name
     *
     * @param {string} name - target name
     * @return {boolean}
     * */
    isInvalid(name: string): boolean;

    /**
     * Check inert failed or conflicted, by name
     *
     * @param {string} name - target name
     * @return {boolean}
     * */
    isFailed(name: string): boolean;

    /**
     * Check inert failed or conflicted, by name
     *
     * @param {string} name - target name
     * @return {boolean}
     * */
    isConflicted(name: string): boolean;

    /**
     * Check inert defined as eager, by name
     *
     * @param {string} name - target name
     * @return {boolean}
     * */
    isEager(name: string): boolean;

    /**
     * Check inert defined or not, by name
     *
     * @param {string} name - target name
     * @return {boolean}
     * */
    has(name: string): boolean;

    /**
     * Get inert by name
     *
     * @param {string} name - target name
     * @return {InertItem}
     * */
    get(name: string): L;

    /**
     * Load lazy inert by name
     * Note:
     * - Target must be exported as `foretell`
     *
     * @param {string} name - target name
     * @return {Promise<InertItem>}
     * @async
     * */
    load(name: string): Promise<L>;
}

// endregion inert

// region error-pool
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

export type ErrorPoolOpt = InertOpt<ClassLike> & ErrorItemConfig;

export type ErrorPoolItem = InertItem<ClassLike> & ErrorPoolOpt;
export type ErrorPoolLike = InertLike<InertItem<ClassLike>, ClassLike, ErrorPoolOpt>;
// endregion error-pool

// region error-common
/**
 * Bare omit error without any property
 * */
export type OmitError = Omit<Error, 'name' | 'message' | 'stack'>;

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
}

// endregion error-common

// region enum
export type Enum<E extends KeyValue = KeyValue> = { [K in E]: KeyValue };
export type EnumAlt<E extends KeyValue = KeyValue> = Dict<E>;

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
}

// endregion enum

// region enum-pool
export interface EnumPoolOpt extends InertOpt<Enum>, EnumItemConfig {

    /**
     * Alternative map path
     * */
    lazyAlt?: Promise<EnumAlt>;
}

export type EnumPoolItem = InertItem<Enum> & EnumPoolOpt;

export interface EnumPoolLike extends InertLike<InertItem<Enum>, Enum, EnumPoolOpt> {
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
}

// endregion enum-pool

// region literal
export type Literal<E extends KeyValue = KeyValue> = Array<E> | ReadonlyArray<E>;
export type LiteralAlt<E extends KeyValue = KeyValue> = Dict<E>;
// endregion literal

// region literal-pool
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
    alt?: EnumAlt;
}

export interface LiteralPoolOpt extends InertOpt<Literal>, LiteralItemConfig {

    /**
     * Alternative map path
     * */
    lazyAlt?: Promise<EnumAlt>;
}

export type LiteralPoolItem = InertItem<Literal> & LiteralPoolOpt;

export interface LiteralPoolLike extends InertLike<InertItem<Literal>, Literal, LiteralPoolOpt> {
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
}

// endregion literal-pool

// region deploy-common
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

// endregion deploy-common

// region event-common
/**
 * Default event types
 * */
export type EventType = 'log' | 'error:emit' | 'context:set-finder';

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

// endregion event-common

// region lifecycle-common
/**
 * Lifecycle stages
 * */
export type LifecycleStage =
    | 'initialize'
    | 'print'
    | 'validate'
    | 'process'
    | 'clear'
    | 'ota-before'
    | 'ota-after'
    | 'kill';

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

// endregion lifecycle-common


// region log-common
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

    // region setters
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

    // endregion setters

    initConsume(): void;

    // region local-functions

    // endregion local-functions
    emitLog(level: LogLevel, where: string, message: any, params?: any | Opt): void

}

// endregion log-common

// region log
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

// endregion log

// region repo
export interface RepoCommonLike {
    // region array
    newArray<V>(name: string, volatile?: boolean): Array<V>;

    removeArray(key: symbol): number;

    clearArray(key: symbol): number;

    listArrays(): Array<symbol>;

    printArrays(): Record<string, number>;

    // endregion array

    // region list
    newList<V>(name: string, volatile?: boolean): List<V>;

    removeList(key: symbol): number

    clearList(key: symbol): number;

    listLists(): Array<symbol>;

    printLists(): Record<string, number>;

    // endregion list

    // region map
    newMap<K, V>(name: string, volatile?: boolean): Map<K, V>;

    removeMap(key: symbol): number

    clearMap(key: symbol): number;

    listMaps(): Array<symbol>;

    printMaps(): Record<string, number>;

    // endregion map

    // region set
    newSet<V>(name: string, volatile?: boolean): Set<V>;

    removeSet(key: symbol): number

    clearSet(key: symbol): number;

    listSets(): Array<symbol>;

    printSets(): Record<string, number>;

    // endregion set
    init(): void;
}

// endregion repo

// region context
export type ContextFinderLambda = <T = unknown>(...p: Array<unknown>) => T;
// endregion context
