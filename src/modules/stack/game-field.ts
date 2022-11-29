import { checkCollision, rectInRect } from '../shared/collision';
import { EventEmitter } from '../shared/event-emiiter';
import { getDirection } from '../shared/get-direction';
import { Rect } from '../shared/rect';
import { V, Vector } from '../shared/vector';
import { GameObject } from './game-object';

export interface IGFChangeEvent<T> {
  type: 'created' | 'updated' | 'destroyed',
  obj: GameObject<T>
}

class GFCreatedEvent<T> implements IGFChangeEvent<T> {
  type: 'created' = 'created';
  constructor(public obj: GameObject<T>) { }
}


class GFUpdatedEvent<T> implements IGFChangeEvent<T> {
  type: 'updated' = 'updated';
  constructor(public obj: GameObject<T>) { }
}

class GFDestroyEvent<T> implements IGFChangeEvent<T> {
  type: 'destroyed' = 'destroyed';
  constructor(public obj: GameObject<T>) { }
}

export class GameField<T> {
  changes$ = new EventEmitter<IGFChangeEvent<T>>();
  gameObjects: Array<GameObject<T>> = [];

  rect: Rect;
  destroyed = false;

  basicSpeed = 3 * 64 / 1000;

  constructor(
    public size: Vector,
    public position: Vector,
    public gridStep: number,
    public gridSize: Vector
  ) {
    this.rect = new Rect(position, size);
    this.loop(Date.now());
  }

  getRect() {
    return new Rect(this.position, this.size.clone().add(-1));
  }

  addObject(gameObject: GameObject<T>) {
    gameObject.position.add(this.position);
    gameObject.setParent(this);

    this.gameObjects.push(gameObject);
    this.changes$.next(new GFCreatedEvent(gameObject));
  }

  loop(lastCallTime: number) {
    if (this.destroyed) { return; }
    
    const nowTime = Date.now();
    const tDelta = nowTime - lastCallTime;

    this.gameObjects.forEach((obj: GameObject<T>) => {
      this.addGravityMoveIdCan(obj);
      this.processMoving(tDelta, obj);
      this.chekFullRow();
    });

    requestAnimationFrame(() => this.loop(nowTime));
  }

  chekFullRow() {
    const leftBottomBlockPosition = V(this.position.x, this.position.y + this.gridStep * (this.gridSize.height - 1));

    const leftBottomBlock = this.gameObjects.find(obj => obj.position.isEqual(leftBottomBlockPosition));

    const blocksForDestroy = [];
    let block = leftBottomBlock;
    let index = 0;
    while (block && block.type === 'block' && !block.inMove && index < this.gridSize.width) {
      const { blockers } = this.checkMovingOpportunity(block, V(1, 0));
      blocksForDestroy.push(block);
      block = blockers[0] === "overflow" ? null : blockers[0];
      index++;
    }

    if (index !== this.gridSize.width) { return; }

    blocksForDestroy.forEach(block => this.destroyObject(block));
  }

  destroyObject(obj: GameObject<T>) {
    const index = this.gameObjects.indexOf(obj);
    if (index >= 0) {
      this.gameObjects.splice(index, 1);
      this.changes$.next(new GFDestroyEvent(obj));
    }
  }

  addGravityMoveIdCan(obj: GameObject<T>) {
    if (obj.inMove) { return; }

    if (!this.checkMovingOpportunity(obj, V(0, 1)).canFreeMove) {
      return;
    }

    obj.goTo(V(obj.position.x, this.getNextGridPoint('y', obj.position.y)));
  }

  processMoving(tDelta: number, obj: GameObject<T>) {
    if (!obj.inMove) { return; }

    let movingAxis: keyof Vector;

    if (obj.position.x !== obj.nextPosition.x) {
      movingAxis = 'x';
    } else {
      movingAxis = 'y';
    }

    let currentPos = obj.position[movingAxis];
    const nextPosition = obj.nextPosition[movingAxis];

    const direction = getDirection(currentPos, nextPosition);

    obj.position[movingAxis] += tDelta * this.basicSpeed * direction;
    currentPos = obj.position[movingAxis];

    const isObjecMovedFarThenNeed = direction != getDirection(currentPos, nextPosition);
    const isObjSoNeadToNextPosition = Math.abs(currentPos - nextPosition) < this.basicSpeed

    if (isObjecMovedFarThenNeed || isObjSoNeadToNextPosition) {
      obj.position[movingAxis] = nextPosition;
      obj.movingEnded();
    }

    this.changes$.next(new GFUpdatedEvent(obj));
  }

  getNextGridPoint(axis: 'y' | 'x', currentPosition: number): number {
    let pos = axis === 'x' ? this.position.x : this.position.y;
    while (pos <= currentPosition) {
      pos += this.gridStep;
    }
    return pos;
  }

  checkMovingOpportunity(obj: GameObject<T>, direction: Vector): { canFreeMove: boolean, blockers: Array<GameObject<T> | 'overflow'> } {
    let potentialSpace: Rect;

    if (direction.x) {
      const position = obj.position.clone().add(direction.x > 0 ? V(obj.size.width - 1, 0) : V(-1, 0));
      potentialSpace = new Rect(position, V(1, obj.size.height - 1));
    } else if (direction.y) {
      const position = obj.position.clone().add(direction.y > 0 ? V(0, obj.size.height - 1) : V(0, -1));
      potentialSpace = new Rect(position, V(obj.size.width - 1, 1));
    } else {
      console.trace('Zero direction moving');
      throw new Error();
    }

    if (!rectInRect(this.getRect(), potentialSpace)) {
      return { canFreeMove: false, blockers: ['overflow'] }
    }

    const blockers: Array<GameObject<T> | 'overflow'> = [];

    for (const _obj of this.gameObjects) {
      if (_obj !== obj && checkCollision(potentialSpace, _obj.getRect())) {
        blockers.push(_obj);
      }
    }
    return {
      canFreeMove: !blockers.length,
      blockers
    }
  }

  destroy() {
    this.destroyed = true;
    this.gameObjects.forEach(this.destroyObject.bind(this));
  }
}