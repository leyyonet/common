import { LeyyoError } from "./leyyo.error.js";
import { KEY_ERROR_DEFAULT_MESSAGE } from "../const/index.js";

/**
 * Invalid value error
 * */
export class InvalidValueError extends LeyyoError {
  static {
    this[KEY_ERROR_DEFAULT_MESSAGE] = "Invalid value";
  }
}
