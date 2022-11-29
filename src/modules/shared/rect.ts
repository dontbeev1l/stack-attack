import { V, Vector } from './vector';

export class Rect {
  leftTop: Vector;
  leftBottom: Vector;
  rightTop: Vector;
  rightBottom: Vector;
  constructor(postion: Vector, size: Vector) {
    this.leftTop = postion.clone();
    this.leftBottom = V(postion.x, postion.y + size.y);
    this.rightTop = V(postion.x + size.x, postion.y);
    this.rightBottom = V(postion.x + size.x, postion.y + size.y);
  }
}