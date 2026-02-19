import { randomTestNo } from "./random-test-no.js";
import { FQN } from "../internal.js";

/**
 * Build test case
 *
 * @param {string} pck - Package or FQN name
 * @param {(string|number)} caseNo
 * @return {string}
 * */
export function testCase(pck: string, caseNo: string | number): string {
  pck = typeof pck === "string" ? pck : FQN;
  let caseStr: string;
  if (typeof caseNo === "string") {
    caseStr = caseNo;
  } else if (typeof caseNo === "number") {
    caseStr = caseNo.toString(10);
  } else {
    caseStr = randomTestNo();
  }
  return `${pck}#${caseStr}`;
}
