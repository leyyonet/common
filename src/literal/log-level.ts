import { LogLevel } from "../type.js";

const literals = ["debug", "trace", "info", "warn", "error", "fatal"] as const;
/**
 * Log Level
 * */
export const LogLevelItems = literals as ReadonlyArray<LogLevel>;
