import { assert, describe, it } from "vitest";
import { enumPool } from "../src/index.js";

enum Color {
  RED = 1,
  BLUE = 2,
  GREEN = 3,
}
enum BW {
  BLACK = 11,
  WHITE = 12,
  GRAY = 13,
}
enum Both {
  RED = 1,
  BLUE = 2,
  GREEN = 3,
  BLACK = 11,
  WHITE = 12,
  GRAY = 13,
}

const literalColors = enumPool.toLiteral(Color);
const both = enumPool.merge<typeof Both>(Color, BW);
const literalBoth = enumPool.toLiteral(both);

enum Color2 {
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
}
enum BW2 {
  BLACK = "black",
  WHITE = "white",
  GRAY = "gray",
}
enum Both2 {
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  BLACK = "black",
  WHITE = "white",
  GRAY = "gray",
}

const literalColors2 = enumPool.toLiteral(Color2);
const both2 = enumPool.merge<typeof Both>(Color2, BW2);
const literalBoth2 = enumPool.toLiteral(both2);

describe("enum", () => {
  describe("number", () => {
    it("toLiteral", () => {
      assert.deepEqual(literalColors, [1, 2, 3]);
    });
    it("merge", () => {
      // @ts-ignore
      assert.equal(both.RED, Color.RED);
      // @ts-ignore
      assert.equal(both.BLACK, BW.BLACK);
    });
    it("literal merged", () => {
      assert.deepEqual(literalBoth, [1, 2, 3, 11, 12, 13]);
    });
  });
  describe("string", () => {
    it("toLiteral", () => {
      // @ts-ignore
      assert.deepEqual(literalColors2, ["red", "blue", "green"]);
    });
    it("merge", () => {
      // @ts-ignore
      assert.equal(both2.RED, Color2.RED);
      // @ts-ignore
      assert.equal(both2.BLACK, BW2.BLACK);
    });
    it("literal merged", () => {
      // @ts-ignore
      assert.deepEqual(literalBoth2, ["red", "blue", "green", "black", "white", "gray"]);
    });
  });
});
