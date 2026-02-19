import { leyyo } from "./base/index.js";
import { FQN } from "./internal.js";

// noinspection JSUnusedGlobalSymbols
export const foretell_leyyoCommon = [
  // errors
  () =>
    leyyo.errorPool.lazy(
      FQN,
      "CausedError",
      import("./error/caused.error.js").then((m) => m.CausedError),
      { i18n: true, emit: true },
    ),
  () =>
    leyyo.errorPool.lazy(
      FQN,
      "DeveloperError",
      import("./error/developer.error.js").then((m) => m.DeveloperError),
      { i18n: true, emit: true },
    ),
  () =>
    leyyo.errorPool.lazy(
      FQN,
      "HttpError",
      import("./error/http.error.js").then((m) => m.HttpError),
      { i18n: true, emit: true },
    ),
  () =>
    leyyo.errorPool.lazy(
      FQN,
      "InvalidValueError",
      import("./error/invalid-value.error.js").then((m) => m.InvalidValueError),
      { i18n: true, emit: true },
    ),
  () =>
    leyyo.errorPool.lazy(
      FQN,
      "LeyyoError",
      import("./error/leyyo.error.js").then((m) => m.LeyyoError),
      { i18n: true, emit: false },
    ),
  () =>
    leyyo.errorPool.lazy(
      FQN,
      "MultipleError",
      import("./error/multiple.error.js").then((m) => m.MultipleError),
      { i18n: true, emit: true },
    ),

  // enums
  () =>
    leyyo.literalPool.lazy(
      FQN,
      "LogLevel",
      import("./enum/log-level.js").then((m) => m.LogLevelItems),
      { i18n: true },
    ),
];
