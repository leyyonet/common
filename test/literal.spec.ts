import { assert, beforeAll, describe, it } from "vitest";
import { literalPool } from "../src/index.js";

beforeAll(() => {
  if (global) {
    global.leyyo_is_testing = true;
  } else if (globalThis) {
    globalThis.leyyo_is_testing = true;
  }
});

const Color = ["blue", "green", "red", "yellow"] as ReadonlyArray<string>;
const Status = ["married", "single", "divorced", "other"] as ReadonlyArray<string>;

describe("literal", () => {
  it("register", () => {
    assert.doesNotThrow(() =>
      literalPool.register({ target: Color, name: "Color", aliases: ["Renk"], pck: "com.lemon" }),
    );
  });
  it("has - basic name", () => {
    assert.equal(literalPool.has("Color"), true);
  });
  it("has - full name", () => {
    assert.equal(literalPool.has("com.lemon.Color"), true);
  });
  it("has - alias", () => {
    assert.equal(literalPool.has("Renk"), true);
  });
});
