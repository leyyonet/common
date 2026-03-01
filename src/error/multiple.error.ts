import { LeyyoErrorLike } from "../type.js";
import { LeyyoError } from "./leyyo.error.js";
import { CausedError } from "./caused.error.js";
import {
  KEY_ERROR_DEFAULT_MESSAGE,
  KEY_ERROR_EMIT,
  KEY_ERROR_I18N,
  KEY_FQN_PACKAGE,
} from "../const.js";
import { PCK } from "../internal.js";

// noinspection Annotator
/**
 * Multiple error which manages multiple errors
 * */
export class MultipleError extends LeyyoError {
  declare causedBy: Array<LeyyoErrorLike>;

  /**
   * @param {...Error[]} errors
   * */
  constructor(...errors: Array<Error>) {
    const first = errors.length > 0 ? errors[0] : undefined;
    super(first?.message ?? "Multiple error", {});
    this.causedBy = [];
    this.push(...errors);
  }

  push(...errors: Array<Error>): this {
    errors.forEach((e) => {
      if (e instanceof MultipleError) {
        this.causedBy.push(...e.causedBy);
      } else if (e instanceof LeyyoError) {
        this.causedBy.push(e);
      } else {
        this.causedBy.push(CausedError.of(e));
      }
    });
    return this;
  }

  static {
    this[KEY_FQN_PACKAGE] = PCK;
    this[KEY_ERROR_DEFAULT_MESSAGE] = "Multiple error";
    this[KEY_ERROR_EMIT] = true;
    this[KEY_ERROR_I18N] = true;
  }
}
