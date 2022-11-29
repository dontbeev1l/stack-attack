export class Vector {
  get width() {
    return this.x;
  }

  get height() {
    return this.y;
  }

  constructor(
    public x: number,
    public y: number
  ) { }

  multiply(multiplayer: number): Vector {
    this.x = this.x * multiplayer;
    this.y = this.y * multiplayer;

    return this;
  }

  add(num: number): Vector
  add(vector: Vector): Vector
  add(value: unknown): Vector {
    if (value instanceof Vector) {
      this.x += value.x;
      this.y += value.y;
      return this;
    }

    if (typeof value === 'number') {
      this.x += value;
      this.y += value;
      return this;
    }
  }

  clone() {
    return V(this.x, this.y);
  }

  isEqual(v: Vector) {
    return this.x === v.x && this.y === v.y;
  }
}

export function V(x: number, y: number): Vector {
  return new Vector(x, y);
}