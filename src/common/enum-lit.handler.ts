import { EnumLitHandlerLike, EnumLitRaw, KeyValue, Pair, View } from "../type.js";
import * as fs from "node:fs";

/**
 * Language handler class
 * */
export abstract class EnumLitHandler<
  E extends KeyValue,
  A extends EnumLitRaw,
  P extends Pair<E>,
  V extends View<E>,
> implements EnumLitHandlerLike<E, A, P, V> {
  /**
   * Raw records which is loaded from corresponding map file
   * */
  protected _raw: Record<E, A>;

  protected constructor(
    protected _codes: ReadonlyArray<E>,
    fullPath?: string,
  ) {
    if (fullPath && fs.existsSync(fullPath)) {
      this._raw = JSON.parse(fs.readFileSync(fullPath, "utf8")) as Record<E, A>;
    } else {
      this._raw = {} as Record<E, A>;
    }
  }

  /** @inheritDoc */
  get codes(): ReadonlyArray<E> {
    return [...this._codes];
  }

  /** @inheritDoc */
  has(code: E): boolean {
    if (typeof code !== "string") {
      return false;
    }
    return this._raw[code] !== undefined;
  }

  /** @inheritDoc */
  raw(code: E): A {
    if (typeof code !== "string") {
      return undefined;
    }
    return this._raw[code];
  }

  /** @inheritDoc */
  name(code: E): string {
    if (typeof code !== "string") {
      return undefined;
    }
    return this.raw(code)?.n ?? code;
  }

  /** @inheritDoc */
  allPairs(): Array<P> {
    return this._codes.map((code) => this.pair(code));
  }

  /** @inheritDoc */
  selectedPairs(...codes: Array<E>): Array<P> {
    return codes
      .filter((code) => typeof code === "string")
      .filter((code) => this._codes.includes(code))
      .map((code) => this.pair(code));
  }

  /** @inheritDoc */
  pair(code: E): P {
    const item = this.raw(code);
    if (!item) {
      return { id: code, name: code } as P;
    }
    return { id: code, name: item.n } as P;
  }

  /** @inheritDoc */
  abstract view(code: E): V;
}
