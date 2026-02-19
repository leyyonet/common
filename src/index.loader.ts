import { defineLoader } from "./function/index.js";
import { FQN } from "./internal.js";

// noinspection JSUnusedGlobalSymbols
export const loader_leyyoCommon = defineLoader(
  FQN,
  // errors
  () => import("./error/caused.error.js").then((m) => m.CausedError),
  () => import("./error/developer.error.js").then((m) => m.DeveloperError),
  () => import("./error/http.error.js").then((m) => m.HttpError),
  () => import("./error/invalid-value.error.js").then((m) => m.InvalidValueError),
  () => import("./error/leyyo.error.js").then((m) => m.LeyyoError),
  () => import("./error/multiple.error.js").then((m) => m.MultipleError),
  // enums
  () => import("./enum/log-level.js").then((m) => m.LogLevelItems),
  // classes
  () => import("./class/list.js").then((m) => m.List),
  () => import("./class/logger.instance.js").then((m) => m.LoggerInstance),
);
