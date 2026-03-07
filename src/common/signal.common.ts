import { isText, testCase } from "../function/index.js";
import { LeyyoLike, SignalCallback, SignalCommonLike } from "../type.js";
import { PCK } from "../internal.js";

const where = `${PCK}.SignalCommon`;

/**
 * Signal common class
 *
 * Generics:
 * - K: key type
 * */
export class SignalCommon<K extends string = string> implements SignalCommonLike {
  // key -> array of resolve functions
  private readonly _waiters: Map<K, Array<SignalCallback>>;
  // key -> done value
  private readonly _values: Map<K, unknown>;

  constructor(private leyyo: LeyyoLike) {
    this._waiters = this.leyyo.repoCommon.newMap<K, Array<SignalCallback>>(`${where}.waiters`);
    this._values = this.leyyo.repoCommon.newMap<K, unknown>(`${where}.values`);
  }

  /** @inheritDoc */
  fork<K2 extends string>(): SignalCommonLike<K2> {
    return this as unknown as SignalCommonLike<K2>;
  }

  /** @inheritDoc */
  async wait<R = unknown>(key: K): Promise<R> {
    if (!isText(key)) {
      throw new this.leyyo.developerError("Invalid key", testCase(PCK, "signal", "xxx"), where);
    }
    // If it's already ready, directly resolve it
    if (this._values.has(key)) {
      return (await Promise.resolve(this._values.get(key)!)) as Promise<R>;
    }

    // Add wait request into waiter callbacks
    return new Promise((resolve) => {
      if (this._waiters.has(key)) {
        this._waiters.get(key).push(resolve);
      } else {
        this._waiters.set(key, [resolve]);
      }
    });
  }

  /** @inheritDoc */
  done<R = unknown>(key: K, value: R): void {
    if (!isText(key)) {
      throw new this.leyyo.developerError("Invalid key", testCase(PCK, "signal", "xxx"), where);
    }
    this._values.set(key, value);

    if (!this._waiters.has(key)) {
      return;
    }
    const callbacks = this._waiters.get(key);
    this._waiters.delete(key);
    callbacks.forEach((callback) => callback(value));
  }

  /** @inheritDoc */
  isDone(key: K): boolean {
    if (!isText(key)) {
      return false;
    }
    return this._values.has(key);
  }
}

/**
 *
 * const signal = new AsyncSignal<string>();
 *
 * // Worker 1
 * async function worker1() {
 *   const result = await signal.wait("job-1");
 *   console.log("Worker1 done:", result);
 * }
 *
 * // Worker 2
 * async function worker2() {
 *   const result = await signal.wait("job-1");
 *   console.log("Worker2 done:", result);
 * }
 *
 * // DB / async process
 * async function dbProcess() {
 *   console.log("DB started");
 *   await new Promise(r => setTimeout(r, 2000));
 *   console.log("DB finished");
 *
 *   signal.done("job-1", "OK"); // tüm _waiters resolve olacak
 * }
 *
 * worker1();
 * worker2();
 * dbProcess();
 * */
