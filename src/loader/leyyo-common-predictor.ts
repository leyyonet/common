import { PCK } from "../internal.js";
import { definePredictor, leyyo } from "../index.js";

// noinspection JSUnusedGlobalSymbols
export const leyyoCommonPredictor = definePredictor(PCK)
  .add(
    () =>
      leyyo.errorPool.lazy(
        PCK,
        "CausedError",
        import("../error/caused.error.js").then((m) => m.CausedError),
      ),
    () =>
      leyyo.errorPool.lazy(
        PCK,
        "DeveloperError",
        import("../error/developer.error.js").then((m) => m.DeveloperError),
      ),
    () =>
      leyyo.errorPool.lazy(
        PCK,
        "HttpError",
        import("../error/http.error.js").then((m) => m.HttpError),
      ),
    () =>
      leyyo.errorPool.lazy(
        PCK,
        "InvalidValueError",
        import("../error/invalid-value.error.js").then((m) => m.InvalidValueError),
      ),
    () =>
      leyyo.errorPool.lazy(
        PCK,
        "LeyyoError",
        import("../error/leyyo.error.js").then((m) => m.LeyyoError),
      ),
    () =>
      leyyo.errorPool.lazy(
        PCK,
        "MultipleError",
        import("../error/multiple.error.js").then((m) => m.MultipleError),
      ),
  )
  .add(() =>
    leyyo.literalPool.lazy(
      PCK,
      "LogLevel",
      import("../literal/log-level.js").then((m) => m.LogLevelItems),
      { i18n: true },
    ),
  )
  .end();
