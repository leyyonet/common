import { assert, describe, it } from "vitest";
import { CausedError } from "../src/index.js";

describe("error", () => {
  it("not symbol", () => {
    assert.throws(() => {
      throw new CausedError("invalid");
    });
  });
});
