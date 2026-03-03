import { assert, beforeAll, describe, it } from "vitest";
import { enumPool, getFqn, hasFqn, literalPool, deleteFqn, setFqn } from "../src/index.js";
beforeAll(() => {
  if (global) {
    global.leyyo_is_testing = true;
  } else if (globalThis) {
    globalThis.leyyo_is_testing = true;
  }
});

function xyz() {}
class Abc {}
const Def = class {};
const instance = new Abc();

const Color = ["blue", "green", "red", "yellow"] as ReadonlyArray<string>;
enum Status {
  married = "married",
  single = "single",
  divorced = "divorced",
}

describe("fqn", () => {
  describe("function", () => {
    it("has at first", () => {
      assert.equal(hasFqn(xyz), false);
    });
    it("set", () => {
      assert.equal(setFqn(xyz, "foo"), "foo.xyz");
    });
    it("get after set", () => {
      assert.equal(getFqn(xyz), "foo.xyz");
    });
    it("has after set", () => {
      assert.equal(hasFqn(xyz), true);
    });
    it("get after remove", () => {
      deleteFqn(xyz);
      assert.equal(getFqn(xyz), "xyz");
    });
    it("has after remove", () => {
      assert.equal(hasFqn(xyz), false);
    });
  });
  describe("class", () => {
    it("has at first", () => {
      assert.equal(hasFqn(Abc), false);
    });
    it("set", () => {
      assert.equal(setFqn(Abc, "foo"), "foo.Abc");
    });
    it("get after set", () => {
      assert.equal(getFqn(Abc), "foo.Abc");
    });
    it("has after set", () => {
      assert.equal(hasFqn(Abc), true);
    });
    it("get after remove", () => {
      deleteFqn(Abc);
      assert.equal(getFqn(Abc), "Abc");
    });
    it("has after remove", () => {
      assert.equal(hasFqn(Abc), false);
    });
  });
  describe("anonymous class", () => {
    it("has at first", () => {
      assert.equal(hasFqn(Def), false);
    });
    it("set", () => {
      assert.equal(setFqn(Def, "foo"), "foo.Def");
    });
    it("get after set", () => {
      assert.equal(getFqn(Def), "foo.Def");
    });
    it("has after set", () => {
      assert.equal(hasFqn(Def), true);
    });
    it("get after remove", () => {
      deleteFqn(Def);
      assert.equal(getFqn(Def), "Def");
    });
    it("has after remove", () => {
      assert.equal(hasFqn(Def), false);
    });
  });
  describe("literal", () => {
    literalPool.setConfigItem(Color, { name: "Color" });
    it("has at first", () => {
      assert.equal(hasFqn(Color), false);
    });
    it("set", () => {
      assert.equal(setFqn(Color, "foo"), "foo.Color");
    });
    it("get after set", () => {
      assert.equal(getFqn(Color), "foo.Color");
    });
    it("has after set", () => {
      assert.equal(hasFqn(Color), true);
    });
    it("get after remove", () => {
      deleteFqn(Color);
      assert.equal(getFqn(Color), "Color");
    });
    it("has after remove", () => {
      assert.equal(hasFqn(Color), false);
    });
  });
  describe("enum", () => {
    enumPool.setConfigItem(Status, { name: "Status" });
    it("has at first", () => {
      assert.equal(hasFqn(Status), false);
    });
    it("set", () => {
      assert.equal(setFqn(Status, "foo"), "foo.Status");
    });
    it("get after set", () => {
      assert.equal(getFqn(Status), "foo.Status");
    });
    it("has after set", () => {
      assert.equal(hasFqn(Status), true);
    });
    it("get after remove", () => {
      deleteFqn(Status);
      assert.equal(getFqn(Status), "Status");
    });
    it("has after remove", () => {
      assert.equal(hasFqn(Status), false);
    });
  });

  describe("instance", () => {
    it("get", () => {
      setFqn(Abc, "foo2");
      assert.equal(getFqn(instance), "foo2.Abc");
    });
    it("has", () => {
      assert.equal(hasFqn(instance), true);
    });

    it("set - SHOULD NOT WORK", () => {
      assert.equal(setFqn(instance, "bar"), "foo2.Abc");
    });
    it("remove - SHOULD NOT WORK", () => {
      deleteFqn(instance);
      assert.equal(getFqn(instance), "foo2.Abc");
    });
  });
});
