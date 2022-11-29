import { Rect } from './rect';
import { Vector } from './vector';

export function pointInRect(p: Vector, rect: Rect) {
  if (rect.leftTop.x <= p.x && p.x <= rect.rightTop.x
    && rect.leftTop.y <= p.y && p.y <= rect.leftBottom.y) {
    return true;
  }
  return false;
}

export function rectInRect(rect: Rect, internalRect: Rect) {
  return pointInRect(internalRect.leftBottom, rect)
      && pointInRect(internalRect.rightBottom, rect)
      && pointInRect(internalRect.leftTop, rect)
      && pointInRect(internalRect.rightTop, rect);
}

export function checkCollision(r1: Rect, r2: Rect): boolean {
  if (pointInRect(r2.leftTop, r1)) {
    return true;
  }

  if (pointInRect(r2.rightTop, r1)) {
    return true;
  }

  if (pointInRect(r2.leftBottom, r1)) {
    return true;
  }

  if (pointInRect(r2.rightBottom, r1)) {
    return true;
  }

  if (pointInRect(r1.leftTop, r2)) {
    return true;
  }

  if (pointInRect(r1.rightTop, r2)) {
    return true;
  }

  if (pointInRect(r1.leftBottom, r2)) {
    return true;
  }

  if (pointInRect(r1.rightBottom, r2)) {
    return true;
  }

  return false;
}