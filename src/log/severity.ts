/**
 * Severity items
 * */
export const SeverityItems = ['debug', 'error', 'fatal', 'info', 'log', 'trace', 'warn'] as const;
/**
 * Severity for log and errors
 * */
export type Severity = typeof SeverityItems[number];
