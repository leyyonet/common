import { KEY_DEVELOPER_CASE, KEY_DEVELOPER_WHERE, KEY_LEYYO_SECURE } from "../const.js";
import { LeyyoLike } from "../type.js";
import { DeveloperErrorLike, ErrorStackLine } from "../type.js";

// region properties
let _leyyo: LeyyoLike;

// endregion properties

/** Developer error */
export class DeveloperError extends Error implements DeveloperErrorLike {
  protected [KEY_DEVELOPER_CASE]: string;
  protected [KEY_DEVELOPER_WHERE]: string;

  /** @inheritDoc */
  stackTrace?: Array<ErrorStackLine>;

  /**
   * @param {string} message - error message
   * @param {string} issue - test case
   * @param {string} where - where
   * */
  constructor(message: string, issue?: string, where?: string) {
    message = message ?? "Developer error";
    super(message);
    if (typeof issue === "string") {
      this[KEY_DEVELOPER_CASE] = issue;
    }
    if (typeof where === "string") {
      this[KEY_DEVELOPER_WHERE] = where;
    }
    _leyyo.errorCommon.buildStack(this);
  }

  static [KEY_LEYYO_SECURE](leyyo: LeyyoLike) {
    if (!_leyyo) {
      _leyyo = leyyo;
    }
  }

  /** @inheritDoc */
  log(err?: Error): void {
    if (err instanceof Error) {
      this["causedBy"] = err;
    }
    _leyyo.logCommon.emitLog(
      "fatal",
      this[KEY_DEVELOPER_WHERE],
      this,
      _leyyo.errorCommon.toJsonBasic(this, { testCase: this[KEY_DEVELOPER_CASE] }),
    );
  }
}
