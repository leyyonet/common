import { $$_isTest } from "./internal.js";

// noinspection JSUnusedGlobalSymbols
/**
 * Is current process test?
 *
 * @return {boolean}
 * */
export function isTest(): boolean {
  return $$_isTest();
}
