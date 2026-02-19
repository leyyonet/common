/**
 * Generate random test no
 *
 * @return {string}
 * */
export function randomTestNo(): string {
  return (Math.floor(Math.random() * 999) + 100).toString(10);
}
