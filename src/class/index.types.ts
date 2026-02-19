import { Logger } from "../common/index.js";

export interface LoggerInstanceCtor {
  new (name: string): Logger;
}

/**
 * Extended array interface, ie: Clearable arrays
 * */
export interface ListLike<T = unknown> extends Array<T> {
  /**
   * Clears array items, to align all iteration repositories, like Set, Map etc
   *
   * @return {number} - returns deleted count
   * */
  clear(): number;

  /**
   * Deletes given item
   *
   * @param {any} value - will be deleted record
   * @return {boolean} - is deleted?
   * */
  delete(value: T): boolean;

  /**
   * Deletes by given predicate
   *
   * @param {function} predicate - lambda expression
   * @return {boolean} - is deleted?
   * */
  deleteByLambda(predicate: ListPredicate<T>): boolean;
}

export type ListPredicate<T = unknown> = (value: T, index?: number, arr?: Array<T>) => T;
