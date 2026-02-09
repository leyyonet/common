import {defineEnum} from "../common";

const literals = ['debug', 'trace', 'info', 'warn', 'error', 'fatal'] as const;
/**
 * Log Level
 * */
export type LogLevel = typeof literals[number];
export const LogLevelItems = literals as ReadonlyArray<LogLevel>

defineEnum(LogLevelItems, {name: 'LogLevel', i18n: true})
