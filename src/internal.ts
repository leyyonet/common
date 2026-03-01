import { packageJson } from "./sys/index.js";

export const { PCK } = packageJson(import.meta.url);

export function $initLeyyo(): void {
  try {
    if (global?.console) {
      global.console["fatal"] = (...args: Array<unknown>) => console.error(...args);
    }
  } catch (_e) {
    // Nothing
  }
  try {
    if (globalThis?.console) {
      globalThis.console["fatal"] = (...args: Array<unknown>) => console.error(...args);
    }
  } catch (_e) {
    // Nothing
  }
  try {
    if (console) {
      console["fatal"] = (...args: Array<unknown>) => console.error(...args);
    }
  } catch (_e) {
    // Nothing
  }
}
