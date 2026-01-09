/**
 * Log Level
 * */
const literals = ['debug', 'trace', 'info', 'warn', 'error', 'fatal'] as const;
export type LogLevel = typeof literals[number];
export const LogLevelItems = literals as ReadonlyArray<LogLevel>
