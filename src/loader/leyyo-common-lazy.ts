import { defineLazy } from "../function/index.js";
import { PCK } from "../internal.js";

// noinspection JSUnusedGlobalSymbols
export const leyyoCommonLazy = defineLazy(PCK)
  .add()
  // errors
  .add(
    () => import("../error/caused.error.js").then((m) => m.CausedError),
    () => import("../error/developer.error.js").then((m) => m.DeveloperError),
    () => import("../error/http.error.js").then((m) => m.HttpError),
    () => import("../error/invalid-value.error.js").then((m) => m.InvalidValueError),
    () => import("../error/leyyo.error.js").then((m) => m.LeyyoError),
    () => import("../error/multiple.error.js").then((m) => m.MultipleError),
  )
  // literals
  .add(() => import("../literal/log-level.js").then((m) => m.LogLevelItems))
  // classes
  .add(
    () => import("../base/list.js").then((m) => m.List),
    () => import("../base/logger.instance.js").then((m) => m.LoggerInstance),
  )
  .end();
