const literals = ['automation', 'development', 'local', 'production', 'staging', 'test'] as const;
// noinspection JSUnusedGlobalSymbols
/**
 * Environment
 * */
export type Environment = typeof literals[number];
export const EnvironmentItems = literals as ReadonlyArray<Environment>;
