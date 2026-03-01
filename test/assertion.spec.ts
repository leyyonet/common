import { assert, beforeAll, describe, it } from "vitest";
import { CausedError, initTest } from "../src/index.js";

beforeAll(() => initTest());

describe("error", () => {
  it("not symbol", () => {
    assert.throws(() => {
      throw new CausedError("invalid");
    });
  });
});
