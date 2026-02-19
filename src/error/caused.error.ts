import { LeyyoError } from "./leyyo.error.js";
import { Opt } from "../function/index.js";

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
}
