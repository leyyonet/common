import { LeyyoError } from "./leyyo.error.js";
import { Opt } from "../type.js";
import {
  KEY_ERROR_DEFAULT_MESSAGE,
  KEY_ERROR_EMIT,
  KEY_ERROR_I18N,
  KEY_FQN_PACKAGE,
} from "../const.js";
import { PCK } from "../internal.js";

/**
 * Caused error
 * */
export class CausedError extends LeyyoError {
  /**
   * Cast a native error to caused error
   *
   * @param {Error} e - native error instance
   * @param {Opt?} params - params for error
   * @return {CausedError} - new caused error instance
   * */
  static of(e: Error, params?: Opt): CausedError {
    const err = new CausedError(e.message, params);
    err.causedBy = e;
    err.$secure.$copyProperties(e);
    return err;
  }

  static {
    this[KEY_FQN_PACKAGE] = PCK;
    this[KEY_ERROR_DEFAULT_MESSAGE] = "Caused error";
    this[KEY_ERROR_EMIT] = true;
    this[KEY_ERROR_I18N] = true;
  }
}
