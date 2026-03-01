import { ErrorCommonLike, Opt, ErrorCtor, ErrorItemConfig, ErrorObject } from "../type.js";
import { ClassLike, LeyyoLike, ErrorStackLine, LeyyoErrorLike, LeyyoErrorSecure } from "../type.js";
import {
  getFqn,
  getSymbol,
  isClass,
  isEmpty,
  isFilledArr,
  isFilledObj,
  isObj,
  isText,
  secureJson,
  setSymbol,
  testCase,
} from "../function/index.js";
import * as stackTraceParser from "stacktrace-parser";
import { PCK } from "../internal.js";
import {
  KEY_ERROR_DEFAULT_MESSAGE,
  KEY_ERROR_EMIT,
  KEY_ERROR_EMITTED,
  KEY_ERROR_I18N,
  KEY_ERROR_RAISED,
  VAL_ERROR_UNKNOWN_MESSAGE,
  VAL_ERROR_UNKNOWN_NAME,
} from "../const.js";

const where = `${PCK}.ErrorCommon`;

// noinspection JSUnusedGlobalSymbols
export class ErrorCommon implements ErrorCommonLike {
  private _knownPackages: Map<string, string>;
  private _stats: Map<ErrorCtor, number>;
  readonly started: Date;

  constructor(private leyyo: LeyyoLike) {}

  // region private
  /**
   * Transform error as a bare object
   *
   * @param {Error} err - error instance
   * @param {Opt} existing - existing parameters
   * @param {boolean} ignoreNameMessage - ignore name & message?
   * @param {WeakSet} weakSet - weak set to prevent duplicates
   * @return {Opt?} - bare error object
   * */
  private _toErrorJson(
    err: Error,
    existing: Opt,
    ignoreNameMessage: boolean,
    weakSet: WeakSet<Error>,
  ): Opt {
    if (!(err instanceof Error)) {
      return undefined;
    }
    if (weakSet.has(err)) {
      return undefined;
    }
    weakSet.add(err);
    let result = isObj(existing) ? existing : {};
    const leyyoError = err as LeyyoErrorLike;
    if (isFilledObj(leyyoError.params)) {
      result = { ...result, ...leyyoError.params };
    }
    for (const [k, v] of Object.entries(err)) {
      if (
        typeof k !== "string" ||
        ["undefined", "symbol", "function"].includes(typeof v) ||
        v === null
      ) {
        continue;
      }
      switch (k) {
        case "name":
        case "message":
          if (!ignoreNameMessage) {
            result[k] = v;
          }
          break;
        case "stack":
        case "params":
          break;
        case "causedBy":
          if (v instanceof Error) {
            const causedBy = this._toErrorJson(v, {}, false, weakSet);
            if (causedBy) {
              result[k] = v;
            }
          } else if (isFilledArr(v)) {
            const errors = v as Array<Error>;
            const causedErrors = [] as Array<Opt>;
            errors.forEach((e) => {
              const causedError = this._toErrorJson(e, {}, false, weakSet);
              if (causedError) {
                causedErrors.push(causedError);
              }
            });
            if (causedErrors.length > 0) {
              result[k] = causedErrors;
            }
          }
          break;
        default:
          result[k] = v;
          break;
      }
    }
  }

  /**
   * Build error info part as `<part1/part2>`
   *
   * @param {Array<string|number>} parts - parts for info
   * @return {string}
   * */
  private _buildTextParts(parts: Array<string | number>): string {
    parts = parts
      .map((p) => {
        if (typeof p === "string") {
          p = p.trim();
          return p ? p : undefined;
        } else if (typeof p === "number") {
          return p.toString(10);
        } else {
          return undefined;
        }
      })
      .filter(Boolean);
    return parts.length > 0 ? "<" + parts.join("/") + "> " : "";
  }

  // endregion private

  // region public
  /** @inheritDoc */
  setConfigItem(clazz: ClassLike, conf: ErrorItemConfig): void {
    if (!isClass(clazz)) {
      throw new this.leyyo.developerError(
        "Invalid package name",
        testCase(PCK, "error", "invalid-package-name"),
        where,
      );
    }
    if (!isObj(conf)) {
      throw new this.leyyo.developerError(
        "Invalid package name",
        testCase(PCK, "error", "invalid-config"),
        where,
      );
    }
    if (isText(conf.message)) {
      setSymbol(clazz, KEY_ERROR_DEFAULT_MESSAGE, conf.message);
    }
    if (!isEmpty(conf.emit)) {
      setSymbol(clazz, KEY_ERROR_EMIT, conf.emit);
    }
    if (!isEmpty(conf.i18n)) {
      setSymbol(clazz, KEY_ERROR_I18N, conf.i18n);
    }
  }

  /** @inheritDoc */
  getConfigItem(clazz: ClassLike): ErrorItemConfig {
    return {
      message: getSymbol<string>(clazz, KEY_ERROR_DEFAULT_MESSAGE),
      emit: getSymbol(clazz, KEY_ERROR_EMIT),
      i18n: getSymbol(clazz, KEY_ERROR_I18N),
    } as ErrorItemConfig;
  }

  /** @inheritDoc */
  emit(err: Error): void {
    if (!(err instanceof Error)) {
      return;
    }
    // already emitted
    if (getSymbol<boolean>(err, KEY_ERROR_EMITTED)) {
      return;
    }
    const clazz = err.constructor;

    // error does not support to emit
    if (!getSymbol(clazz, KEY_ERROR_EMIT)) {
      return;
    }

    // prevent duplicated emits
    setSymbol(err, KEY_ERROR_EMITTED, true);
    this.leyyo.eventCommon.emit("error:emit", err);
  }

  /** @inheritDoc */
  buildStack(source: Error, force?: boolean): void {
    const err = source as LeyyoErrorLike;
    if (!force && Array.isArray(err.stackTrace)) {
      return;
    }
    err.stackTrace = [];
    try {
      let causedBy: Error;
      if (err.causedBy) {
        if (Array.isArray(err.causedBy) && err.causedBy.length > 0) {
          causedBy = err.causedBy[0];
        } else if (err.causedBy instanceof Error) {
          causedBy = err.causedBy;
        }
      }
      const original = causedBy?.stack ?? source.stack;
      if (original) {
        const frames = stackTraceParser.parse(original);
        if (Array.isArray(frames)) {
          frames.forEach((frame) => {
            if (["<unknown>", "Object.<anonymous>"].includes(frame.methodName)) {
              frame.methodName = undefined;
            }
            if (frame.file) {
              if (frame.file.startsWith("node:")) {
                frame.file = `@ ` + frame.file.substring(5);
              } else {
                if (this._knownPackages) {
                  for (const [pck, short] of this._knownPackages.entries()) {
                    const index = frame.file.indexOf(pck);
                    if (index >= 0) {
                      let part = frame.file.substring(index + pck.length);
                      if (part.startsWith("/")) {
                        part = part.substring(1);
                      }
                      if (part.startsWith("dist/")) {
                        part = part.substring(5);
                      }
                      frame.file = `#${short} ` + part;
                      break;
                    }
                  }
                }
              }
              if (frame.file.endsWith(".js") || frame.file.endsWith(".ts")) {
                frame.file.substring(0, frame.file.length - 3);
              }
            }
            const line = {} as ErrorStackLine;
            if (frame.file) {
              line.file = frame.file;
            }
            if (frame.methodName) {
              line.method = frame.methodName;
            }
            if (frame.lineNumber !== undefined && frame.column !== undefined) {
              line.pos = `${frame.lineNumber ?? ""}:${frame.column ?? ""}`;
            }
            err.stackTrace.push(line);
          });
        }
      }
    } catch (e) {
      // none
    }
  }

  /** @inheritDoc */
  toJsonBasic(err: Error, existing?: Opt): Opt {
    return this._toErrorJson(err, existing, true, new WeakSet<Error>());
  }

  /** @inheritDoc */
  toJsonFull(err: Error, existing: Opt): Opt {
    return this._toErrorJson(err, existing, false, new WeakSet<Error>());
  }

  /** @inheritDoc */
  cast<E extends LeyyoErrorLike>(e: Error, params?: Opt): E {
    if (!(e instanceof Error)) {
      return new this.leyyo.leyyoError(secureJson(e)) as E;
    }
    if (e instanceof this.leyyo.leyyoError) {
      return e as E;
    }
    const err = new this.leyyo.leyyoError(e.message, params) as E;
    (err as unknown as LeyyoErrorSecure).$copyProperties(e);
    err.causedBy = e;
    return err;
  }

  /** @inheritDoc */
  forcedCast<E extends LeyyoErrorLike>(clazz: ClassLike, e: Error, params?: Opt): E {
    if (!(e instanceof Error)) {
      return new this.leyyo.leyyoError(secureJson(e)) as E;
    }
    if (!isClass(clazz)) {
      return this.cast(e, params);
    }
    if (e instanceof clazz) {
      return e as E;
    }
    const err = new clazz(e.message, params) as E;
    (err as unknown as LeyyoErrorSecure).$copyProperties(e);
    err.causedBy = e;
    return err;
  }

  /** @inheritDoc */
  addKnownPackage(packageName: string, shortName: string): void {
    if (!isText(packageName)) {
      throw new this.leyyo.developerError(
        "Invalid package name",
        testCase(PCK, "error", "invalid-package-name"),
        where,
      );
    }
    if (!isText(shortName)) {
      throw new this.leyyo.developerError(
        `Invalid short name [${packageName}]`,
        testCase(PCK, "error", "invalid-short-name"),
        where,
      );
    }
    if (!this._knownPackages) {
      this._knownPackages = this.leyyo.repoCommon.newMap<string, string>(`${PCK}.knownPackages`);
    }
    if (this._knownPackages.has(shortName)) {
      throw new this.leyyo.developerError(
        `Duplicated package name [${packageName}]`,
        testCase(PCK, "error", "duplicated-package-name"),
        where,
      );
    }
    this._knownPackages.set(packageName, shortName);
  }

  /** @inheritDoc */
  bareObj(err: Error): ErrorObject {
    if (err instanceof Error) {
      return {
        name: err.name ?? VAL_ERROR_UNKNOWN_NAME,
        message: err.message ?? VAL_ERROR_UNKNOWN_MESSAGE,
      };
    }
    return {
      name: VAL_ERROR_UNKNOWN_NAME,
      message: VAL_ERROR_UNKNOWN_MESSAGE,
    };
  }

  /** @inheritDoc */
  text(err: Error, ...parts: Array<string | number>): string {
    const info = parts.length > 0 ? this._buildTextParts(parts) : "";
    if (err instanceof Error) {
      return `${info}[err:${err?.name ?? VAL_ERROR_UNKNOWN_NAME}] => ^/${err?.message ?? VAL_ERROR_UNKNOWN_MESSAGE}/$`;
    }
    return `${info}[err:${VAL_ERROR_UNKNOWN_NAME}] => ^/${VAL_ERROR_UNKNOWN_MESSAGE}/$`;
  }

  /** @inheritDoc */
  addStat(p1: Error | ErrorCtor): number {
    let num = -1;
    try {
      let clazz: ErrorCtor;
      if (isObj(p1)) {
        const err = p1 as Error;
        if (err[KEY_ERROR_RAISED]) {
          return;
        }
        err[KEY_ERROR_RAISED] = true;
        clazz = err.constructor as ErrorCtor;
      } else if (typeof p1 === "function") {
        clazz = p1 as ErrorCtor;
      } else {
        return;
      }
      if (!this._stats) {
        this._stats = this.leyyo.repoCommon.newMap<ErrorCtor, number>(`${PCK}.error`);
      }
      num = this._stats.get(clazz);
      if (num === undefined) {
        num = 1;
      } else {
        num++;
      }
      this._stats.set(clazz, num);
    } catch (e) {
      // nothing
    }
    return num;
  }

  /** @inheritDoc */
  getStat(p1: Error | ErrorCtor): number {
    try {
      let clazz: ErrorCtor;
      if (isObj(p1)) {
        clazz = (p1 as Error).constructor as ErrorCtor;
      } else if (typeof p1 === "function") {
        clazz = p1 as ErrorCtor;
      } else {
        return 0;
      }
      if (!this._stats) {
        return 0;
      }
      return this._stats.get(clazz) ?? 0;
    } catch (e) {
      // nothing
    }
    return 0;
  }

  /** @inheritDoc */
  clearStats(): void {
    if (!this._stats) {
      return;
    }
    this._stats.clear();
  }

  /** @inheritDoc */
  listStats(): Record<string, number> {
    if (!this._stats) {
      return {};
    }
    const map = {} as Record<string, number>;
    for (const [error, num] of this._stats.entries()) {
      map[getFqn(error)] = num;
    }
    return map;
  }

  // endregion public
}
