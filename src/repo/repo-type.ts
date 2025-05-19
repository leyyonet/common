/**
 * Repo type items
 * */
export const RepoTypeItems = ['array', 'list', 'map', 'set'] as const;
/**
 * Repo type literal, as an enum
 * */
export type RepoType = typeof RepoTypeItems[number];
