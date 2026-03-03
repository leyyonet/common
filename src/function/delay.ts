// noinspection JSUnusedGlobalSymbols
/**
 * Delay or sleep for n msec
 *
 * @param {number} waiting - waiting as milliseconds
 * @param {any} response - response value
 * @return {any}
 * @async
 * */
export async function delay<R = undefined>(waiting?: number, response?: R): Promise<R> {
  if (typeof waiting !== "number" || waiting < 10) {
    waiting = Math.round(Math.random() * 1_000);
  } else if (!Number.isSafeInteger(waiting)) {
    waiting = Math.round(waiting);
  }
  return new Promise<R>(() => setTimeout((): R => response, waiting));
}
