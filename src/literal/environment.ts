/**
 * Environment items
 * */
export const EnvironmentItems = ['automation', 'development', 'local', 'production', 'staging', 'test'] as const;
// noinspection JSUnusedGlobalSymbols
/**
 * Environment
 * */
export type Environment = typeof EnvironmentItems[number];
