import { Rec } from "../type.js";
import { $$_setTest } from "./internal.js";

/**
 * Initialize test
 * - Sets `global.leyyo_is_testing = true`
 * - Ignores console methods
 * */
export function initTest(): void {
  $$_setTest();
  try {
    _initTest(global);
  } catch (_e) {
    // nothing
  }
  try {
    _initTest(globalThis);
  } catch (_e) {
    // nothing
  }
}

function _initTest(item: Rec): boolean {
  if (!item) {
    return false;
  }
  if (item.leyyo_is_testing) {
    return true;
  }
  item.leyyo_is_testing = true;
  ["log", "warn", "info", "debug", "trace", "error", "fatal"].forEach((name) => {
    item.console[name] = _emptyLog;
    console[name] = _emptyLog;
  });
  return true;
}
function _emptyLog(...args: Array<unknown>): void {
  // Nothing
}
