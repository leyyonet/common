import {
  ErrorStackLine,
  LeyyoErrorLike,
  LeyyoErrorSecure,
  LeyyoErrorTag,
  Logger,
  LogLevel,
  Opt,
} from "../type.js";
import { ClassLike, LeyyoLike, Obj, OneOrMore, StrKey } from "../type.js";
import {
  getFqn,
  getSymbol,
  isFilledObj,
  isObj,
  optAdd,
  optAppend,
  setSymbol,
} from "../function/index.js";
import {
  KEY_ERROR_DEFAULT_MESSAGE,
  KEY_ERROR_EMIT,
  KEY_ERROR_FLAGS,
  KEY_ERROR_I18N,
  KEY_ERROR_WHERE,
  KEY_FQN_PACKAGE,
  KEY_LEYYO_SECURE,
  VAL_ERROR_UNKNOWN_MESSAGE,
} from "../const.js";
import { PCK } from "../internal.js";
import { LogLevelItems } from "../literal/index.js";

type T2 = LeyyoErrorTag;
let _leyyo: LeyyoLike;

// region property
const _errorField = ["name", "message", "stack"] as Array<StrKey<Error>>;
const _leyyoErrorFields = [..._errorField, "params", "causedBy", "stackTrace"] as Array<
  StrKey<LeyyoErrorLike>
>;

// endregion property
/**
 * Leyyo base error
 * */
export class LeyyoError extends Error implements LeyyoErrorLike, LeyyoErrorSecure {
  /**
   * Error flags
   * */
  private [KEY_ERROR_FLAGS]: Set<T2>;

  /**
   * Error parameters
   * */
  params?: Opt;

  /**
   * Caused by error
   * */
  causedBy?: OneOrMore<Error>;

  /**
   * Stack trace
   * */
  stackTrace?: Array<ErrorStackLine>;

  /**
   * */
  constructor();

  /**
   * @param {string} message - error message
   * */
  constructor(message: string);

  /**
   * @param {Opt} params - error parameters
   * */
  constructor(params: Opt);

  /**
   * @param {string} message - error message
   * @param {Opt} params - error parameters
   * */
  constructor(message: string, params: Opt);

  /**
   * @param {(string|Opt)?} p1 - error message or error parameters
   * @param {Opt?} p2 - error parameters
   * */
  constructor(p1?: string | Opt, p2?: Opt) {
    let message: string;
    let params: Opt;
    if (typeof p1 === "string") {
      message = p1;
      params = p2;
    } else {
      message = VAL_ERROR_UNKNOWN_MESSAGE;
      params = p1;
    }
    super(message);

    const clazz = this.constructor;
    _leyyo.errorCommon.addStat(this);
    if (!message) {
      const conf = _leyyo.errorCommon.getConfigItem(clazz as ClassLike);
      this.message = conf?.message;
    }

    if (params && typeof params === "object" && !Array.isArray(params)) {
      this.params = params;
    }
    this.name = getFqn(clazz);
    _leyyo.errorCommon.buildStack(this);

    _leyyo.errorCommon.emit(this);
  }

  static [KEY_LEYYO_SECURE](leyyo: LeyyoLike) {
    if (!_leyyo) {
      _leyyo = leyyo;
    }
  }

  // region bind
  causes(err: Error): this {
    if (err instanceof Error) {
      if (!this.causedBy) {
        this.causedBy = err;
      } else if (this.causedBy instanceof Error) {
        this.causedBy = [this.causedBy, err];
      } else if (Array.isArray(this.causedBy)) {
        this.causedBy.push(err);
      } else {
        this.causedBy = [this.causedBy, err];
      }
    }
    return this;
  }

  where(p1: ClassLike | Obj | string, pck?: string): this {
    if (typeof p1 === "function") {
      setSymbol(this, KEY_ERROR_WHERE, getFqn(p1));
    } else if (p1 && typeof p1 === "object") {
      setSymbol(this, KEY_ERROR_WHERE, getFqn(p1));
    } else if (p1 && typeof p1 === "string" && p1.trim()) {
      if (typeof pck === "string") {
        pck = pck.trim();
        pck = pck ? `${pck}.` : "";
      } else {
        pck = "";
      }
      setSymbol(this, KEY_ERROR_WHERE, pck + p1.trim());
    }
    return this;
  }

  // endregion bind

  // region log
  private _log(level: LogLevel, logger?: Logger): void {
    if (logger) {
      logger[level](this);
    } else {
      _leyyo.logCommon.emitLog(level, undefined, this, {});
    }
  }

  /** @inheritDoc */
  raiseOrLog(isLog: boolean, logger?: Logger, level?: LogLevel): void {
    if (!isLog) {
      throw this;
    }
    level = level ?? "warn";
    if (!LogLevelItems.includes(level)) {
      level = "fatal";
    }
    this._log(level, logger);
  }
  /** @inheritDoc */
  log(logger?: Logger): void {
    this._log("error", logger);
  }

  logFatal(logger?: Logger): void {
    this._log("fatal", logger);
  }

  logError(logger?: Logger): void {
    this._log("error", logger);
  }

  /** @inheritDoc */
  logWarn(logger?: Logger): void {
    this._log("warn", logger);
  }

  /** @inheritDoc */
  logDebug(logger?: Logger): void {
    this._log("debug", logger);
  }

  /** @inheritDoc */
  logInfo(logger?: Logger): void {
    this._log("info", logger);
  }

  /** @inheritDoc */
  logTrace(logger?: Logger): void {
    this._log("trace", logger);
  }

  // endregion log

  // region flags
  get $where(): string {
    return getSymbol(this, KEY_ERROR_WHERE);
  }

  $list<T extends T2 | string = T2 | string>(): Array<T> {
    if (this[KEY_ERROR_FLAGS] === undefined) {
      return [];
    }
    return Array.from(this[KEY_ERROR_FLAGS].values()) as Array<T>;
  }

  $append<T extends T2 | string = T2 | string>(key: T): boolean {
    if (this[KEY_ERROR_FLAGS] === undefined) {
      this[KEY_ERROR_FLAGS] = new Set<T2>();
    } else if (this[KEY_ERROR_FLAGS].has(key as T2)) {
      return false;
    }
    this[KEY_ERROR_FLAGS].add(key as T2);
    return true;
  }

  $remove<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean {
    if (this[KEY_ERROR_FLAGS] === undefined) {
      return false;
    }
    if (!this[KEY_ERROR_FLAGS].has(key as T2)) {
      return false;
    }
    this[KEY_ERROR_FLAGS].delete(key as T2);
    if (this[KEY_ERROR_FLAGS].size === 0) {
      delete this[KEY_ERROR_FLAGS];
    }
    return true;
  }

  $has<T extends LeyyoErrorTag | string = LeyyoErrorTag | string>(key: T): boolean {
    if (this[KEY_ERROR_FLAGS] === undefined) {
      return false;
    }
    return this[KEY_ERROR_FLAGS].has(key as T2);
  }

  // endregion flags

  // region methods

  /** @inheritDoc */
  $copyProperties(source: Error): void {
    if (!(source instanceof Error)) {
      return;
    }
    if (!isObj(this.params)) {
      this.params = {};
    }
    if (source instanceof LeyyoError) {
      for (const [k, v] of Object.entries(source)) {
        if (
          !_leyyoErrorFields.includes(k as StrKey<LeyyoErrorLike>) &&
          typeof k === "string" &&
          !["symbol", "function", "undefined"].includes(typeof v)
        ) {
          optAdd(this.params, k, v);
        }
        if (isFilledObj(source.params)) {
          optAppend(this.params, source.params);
        }
      }
    } else {
      for (const [k, v] of Object.entries(source)) {
        if (
          !_errorField.includes(k as StrKey<Error>) &&
          typeof k === "string" &&
          !["symbol", "function", "undefined"].includes(typeof v)
        ) {
          optAdd(this.params, k, v);
        }
      }
    }
  }

  // endregion methods

  // region modes
  get back(): LeyyoErrorLike {
    return this;
  }

  get $secure(): LeyyoErrorSecure {
    return this;
  }

  // endregion modes

  static {
    this[KEY_FQN_PACKAGE] = PCK;
    this[KEY_ERROR_DEFAULT_MESSAGE] = "Unknown error";
    this[KEY_ERROR_EMIT] = true;
    this[KEY_ERROR_I18N] = true;
  }
}
