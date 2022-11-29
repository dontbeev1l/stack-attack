type Directon = 1 | -1;

export function getDirection(cuurent: number, needed: number): Directon {
  return Math.abs(needed - cuurent) / (needed - cuurent) as Directon;
}