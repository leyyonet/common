import { randomTestNo } from "./random-test-no.js";
import { PCK } from "../internal.js";

/**
 * Build test case
 *
 * @param {string} pck - Package or PCK name
 * @param {(string|number)} caseNo
 * @param {Array<string>?} ext
 * @return {string}
 * */
export function testCase(pck: string, caseNo: string | number, ...ext: Array<string>): string {
  pck = typeof pck === "string" ? pck : PCK;
  let caseStr: string;
  if (typeof caseNo === "string") {
    caseStr = caseNo;
  } else if (typeof caseNo === "number") {
    caseStr = caseNo.toString(10);
  } else {
    caseStr = randomTestNo();
  }
  let extStr = "";
  if (ext.length > 0) {
    extStr = ext
      .filter((s) => typeof s === "string")
      .map((s) => s.trim())
      .filter(Boolean)
      .join("|");
    if (extStr) {
      extStr = ":" + extStr;
    }
  }
  return `${pck}#${caseStr}${extStr}`;
}
