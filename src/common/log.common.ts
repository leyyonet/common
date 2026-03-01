import { PCK } from "../internal.js";
import {
  ContextFinderLambda,
  LocalColorLike,
  LogCommonLike,
  LogFormatterLambda,
  Logger,
  LogItem,
  LogStylerLambda,
  LogLevel,
  FqnTarget,
  Opt,
  ClassLike,
  Fnc,
  LeyyoLike,
  Obj,
} from "../type.js";
import {
  getFqn,
  hasFqn,
  isEmpty,
  isFilledObj,
  isObj,
  onFqnSet,
  secureJson,
  testCase,
} from "../function/index.js";
import { KEY_LOG_ALREADY } from "../const.js";

const where = `${PCK}.LogCommon`;
const emptyWhere = "".padStart(20);

// noinspection JSUnusedGlobalSymbols
export class LogCommon implements LogCommonLike {
  // region properties
  /**
   * Loggers
   * */
  private _loggers: Map<string, Logger>;

  /**
   * Local console colors
   *
   * @type {LocalColorLike}
   * */
  private _localColor: LocalColorLike = {
    bold: "\x1b[1m",
    normal: "\x1b[21m",
    end: "\x1b[0m",
    param: "\x1b[90m",
    levels: {
      fatal: [true, "\x1b[31m", "\x1b[91m"], // bold red
      error: [false, "\x1b[31m", "\x1b[91m"], // red
      warn: [false, "\x1b[35m", "\x1b[95m"], // magenta
      info: [false, "\x1b[32m", "\x1b[92m"], // green
      debug: [false, "\x1b[33m", "\x1b[93m"], // yellow
      trace: [false, "\x1b[36m", "\x1b[96m"], // yellow
    },
  };

  private _logFormatter: LogFormatterLambda;
  private _logDeploymentStyler: LogStylerLambda;
  private _logLocalStyler: LogStylerLambda;
  private _logStyler: LogStylerLambda;
  private _contextFinder: ContextFinderLambda;

  // endregion properties

  constructor(private leyyo: LeyyoLike) {
    this._loggers = this.leyyo.repoCommon.newMap(`${where}.loggers`);
    this._defaults();
  }

  // region setters
  /**
   * Set formatter
   *
   * @param {function} fn - lambda for formatter
   * */
  setLogFormatter(fn: LogFormatterLambda): void {
    if (typeof fn !== "function") {
      throw new this.leyyo.developerError("Invalid log formatter", testCase(PCK, 200), where);
    }
    this._logFormatter = fn;
  }

  /**
   * Set deployment styler
   *
   * @param {function} fn - lambda for styler
   * */
  setLogDeploymentStyler(fn: LogStylerLambda): void {
    if (typeof fn !== "function") {
      throw new this.leyyo.developerError("Invalid log styler", testCase(PCK, 201), where);
    }
    this._logDeploymentStyler = fn;

    if (process.env["NODE_ENV"] !== "local") {
      this._logStyler = this._logDeploymentStyler;
    }
  }

  /**
   * Set local style
   *
   * @param {function} fn - lambda for styler
   * */
  setLogLocalStyler(fn: LogStylerLambda): void {
    if (typeof fn !== "function") {
      throw new this.leyyo.developerError("Invalid log local styler", testCase(PCK, 202), where);
    }
    this._logLocalStyler = fn;

    if (process.env["NODE_ENV"] === "local") {
      this._logStyler = this._logLocalStyler;
    }
  }

  /**
   * Set local style
   *
   * @param {function} fn - lambda for styler
   * */
  setContextFinder(fn: ContextFinderLambda): void {
    if (typeof fn !== "function") {
      throw new this.leyyo.developerError("Invalid log local styler", testCase(PCK, 202), where);
    }
    this._contextFinder = fn;
  }

  // endregion setters

  // region private
  private _defaults(): void {
    /**
     * Default log formatter
     *
     * @param {LogItem} item
     * */
    this._logFormatter = (item: LogItem): void => {
      if (item?.ctx) {
        const ctx = item.ctx as { id: number; req: { headers: { "correlation-id": string } } };
        item.ctx = {
          tid: ctx?.id,
          cid: ctx?.req?.headers ? ctx?.req?.headers["correlation-id"] : undefined,
        };
      }
      item.paramStr = item.params ? secureJson(item.params) : undefined;
      delete item.params;
      if (item.paramStr && ["{}", "[]"].includes(item.paramStr as string)) {
        delete item.paramStr;
      }
    };

    /**
     * Default log deployment styler (on server)
     *
     * @param {LogItem} item
     * @return {string}
     * */
    this._logDeploymentStyler = (item: LogItem): string => {
      let message = item.now;
      if (item?.ctx) {
        if (item.ctx["pid"]) {
          message += ` [p:${item.ctx["pid"]}]`;
        } else {
          message += ` [p:]`;
        }
        if (item.ctx["tid"]) {
          message += ` [t:${item.ctx["tid"]}]`;
        } else {
          message += ` [t:]`;
        }
        if (item.ctx["cid"]) {
          message += ` [c:${item.ctx["cid"]}]`;
        } else {
          message += ` [c:]`;
        }
      }
      if (item.where) {
        message += ` [w:${item.where}]`;
      } else {
        message += ` [w:]`;
      }
      message += " " + item.message;
      return message + (item.paramStr ? " ~^~ " + item.paramStr : "");
    };

    /**
     * Default log locale styler (on local computer)
     *
     * @param {LogItem} item
     * @return {string}
     * */
    this._logLocalStyler = (item: LogItem): string => {
      const { bold, end, param } = this._localColor;
      const [isBold, regular, light] =
        this._localColor.levels[item.level] ?? this._localColor.levels.debug;
      let message = item.now.substring(10, 11) + ` ${param}[p:${process.pid}]${end}`;
      if (item?.ctx) {
        if (item.ctx["tid"]) {
          message += ` ${regular}[t:${item.ctx["tid"]}]`;
        } else {
          message += ` ${param}[t:]`;
        }
        if (item.ctx["cid"]) {
          message += ` ${light}[c:${item.ctx["cid"]}]`;
        } else {
          message += ` ${param}[c:]`;
        }
      }
      if (item.where) {
        message += ` ${regular}[${item.where}]`;
      } else {
        message += ` ${param}[${emptyWhere}]`;
      }
      message += ` ${isBold ? bold : ""}${light}${item.message}${end}`;
      return message + (item.paramStr ? ` ~^~ ${param}${item.paramStr}${end}` : "");
    };

    /**
     * Set current styler by environment
     * */
    if (process.env["NODE_ENV"] === "local") {
      this._logStyler = this._logLocalStyler;
    } else {
      this._logStyler = this._logDeploymentStyler;
    }
  }

  /**
   * Build short style of logger name
   *
   * @param {string} where - original logger name
   * @return {string} - short style
   * */
  private _shortenWhere(where: string): string {
    if (!where) {
      return undefined;
    }
    if (!where.includes(".")) {
      return where;
    }
    const parts = where.split(".");
    where = parts.pop();
    if (parts.length > 0) {
      where = parts.map((w) => w.slice(0, 1)).join(".") + "." + where;
    }
    return where;
  }

  /**
   * Log consumer
   *
   * @param {LogItem} item
   * */
  private _consumeLog(item: LogItem): void {
    if (!isObj(item)) {
      return;
    }
    item.where = this._shortenWhere(item.where);
    try {
      this._logFormatter(item);
    } catch (_e) {
      // nothing
    }
    let message: string;
    try {
      message = this._logStyler(item);
    } catch (_e) {
      // nothing
    }
    if (typeof message !== "string") {
      message = `${item?.now} - ${typeof item.message === "string" ? item.message : secureJson(item.message)}`;
      if (item.params) {
        message += ` ~^~ ${secureJson(item.params)}`;
      }
    }
    console[item.level](message);
  }

  /**
   * Generate random logger name
   *
   * @return {string}
   * */
  private _randomLoggerName(): string {
    return this._checkLoggerName("Logger", Math.floor(Math.random() * 1000));
  }

  /**
   * Check logger name's uniqueness, and loop till unique name
   *
   * @param {string} name - base name
   * @param {number} index - try count
   * @return {string}
   * */
  private _checkLoggerName(name: string, index: number): string {
    const fullName = name + (index === 0 ? "" : `#${index}`);
    if (this._loggers.has(fullName)) {
      return this._checkLoggerName(name, index + 1);
    }
    return fullName;
  }

  // endregion private

  // region public
  /** @inheritDoc */
  of(value: ClassLike | Fnc | Obj | string): Logger {
    let name: string;
    let fqnExists: boolean;
    switch (typeof value) {
      case "function":
        fqnExists = hasFqn(value);
        name = this._checkLoggerName(getFqn(value), 0);
        break;
      case "object":
        fqnExists = hasFqn(value);
        name = this._checkLoggerName(getFqn(value), 0);
        break;
      case "string":
        fqnExists = true;
        name = this._checkLoggerName(value, 0);
        break;
      default:
        fqnExists = true;
        name = this._randomLoggerName();
    }
    const ins = new this.leyyo.loggerInstance(name);
    if (!fqnExists) {
      onFqnSet(value as FqnTarget, (f) => ins.$secure.$refreshName(f));
    }
    this._loggers.set(name, ins);
    return ins;
  }

  /** @inheritDoc */
  initConsume(): void {
    // bind to context finder
    this.leyyo.eventCommon.listen("context:set-finder", (v: ContextFinderLambda) => {
      if (typeof v === "function") {
        this._contextFinder = v;
      }
    });

    // bind to event emitter
    this.leyyo.eventCommon.listen("log", (v: LogItem) => this._consumeLog(v));

    this.initConsume = () => {};
  }

  /** @inheritDoc */
  emitLog(level: LogLevel, where: string, message: any, params?: any | Opt): void {
    const item: LogItem = {
      level,
      where,
      now: new Date().toISOString(),
      message: undefined,
      params: undefined,
    };
    if (message instanceof Error) {
      const err = message as Error;
      try {
        if (err[KEY_LOG_ALREADY]) {
          return;
        }
        err[KEY_LOG_ALREADY] = true;
      } catch (_e) {
        // nothing
      }
      item.message = this.leyyo.errorCommon.text(message);
      item.params = this.leyyo.errorCommon.toJsonBasic(message, params);
    } else {
      if (typeof message !== "string") {
        if (isEmpty(message)) {
          message = "??";
        } else {
          if (typeof message === "object") {
            try {
              if (message[KEY_LOG_ALREADY]) {
                return;
              }
              message[KEY_LOG_ALREADY] = true;
            } catch (_e) {
              // nothing
            }
          }
          message = secureJson(message);
        }
      }
      item.message = message;
      item.params = isFilledObj(params) ? params : {};
    }

    if (!item.where && params?.where) {
      try {
        if (typeof params.where === "string") {
          item.where = params.where;
          delete params.where;
        } else if (params.where instanceof Set) {
          const whereList = Array.from(params.where.values());
          item.where = whereList[0] as string;
          params.where.delete(item.where);
        }
      } catch (_e) {
        // nothing
      }
    }
    if (this._contextFinder) {
      try {
        item.ctx = this._contextFinder((item.params as Opt)?.req);
      } catch (_e) {
        // nothing
      }
    }
    this.leyyo.eventCommon.emit("log", item);
  }

  // endregion public
}
