import { LeyyoError } from "./leyyo.error.js";
import {
  KEY_ERROR_DEFAULT_MESSAGE,
  KEY_ERROR_EMIT,
  KEY_ERROR_HTTP_STATUS,
  KEY_ERROR_I18N,
  KEY_FQN_PACKAGE,
} from "../const.js";
import { Opt } from "../type.js";
import { PCK } from "../internal.js";

/**
 * Http error
 * */
export class HttpError extends LeyyoError {
  status: number;

  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected

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
   * @param {(string|Opt)} p1 - error message or error parameters
   * @param {Opt?} p2 - error parameters
   * */
  constructor(p1: string | Opt, p2?: Opt) {
    super(p1 as string, p2);
    const clazz = this.constructor;
    if (Number.isSafeInteger(clazz[KEY_ERROR_HTTP_STATUS])) {
      this.status = clazz[KEY_ERROR_HTTP_STATUS];
    } else {
      this.status = 400;
    }
  }

  static {
    this[KEY_FQN_PACKAGE] = PCK;
    this[KEY_ERROR_DEFAULT_MESSAGE] = "Http error";
    this[KEY_ERROR_EMIT] = true;
    this[KEY_ERROR_I18N] = true;
  }
}
