import { LeyyoError } from "./leyyo.error.js";
import { KEY_ERROR_DEFAULT_MESSAGE, KEY_ERROR_HTTP_STATUS } from "../const/index.js";
import { Opt } from "../function/index.js";

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
    this[KEY_ERROR_DEFAULT_MESSAGE] = "Http error";
  }
}
