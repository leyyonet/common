/**
 * Severity items
 * */
export const SeverityItems = ['debug', 'trace', 'info', 'warn', 'error', 'fatal'] as const;
/**
 * Severity for log and errors
 * */
export type Severity = typeof SeverityItems[number];
