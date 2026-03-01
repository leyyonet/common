/**
 *
 * @param {number} num
 * @return {Array<number>}
 * */
export function times(num: number): Array<number> {
  const arr = [] as Array<number>;
  for (let i = 0; i < num; i++) {
    arr.push(i);
  }
  return arr;
}
