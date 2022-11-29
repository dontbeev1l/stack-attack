import { Rect } from '../shared/rect';
import { V, Vector } from '../shared/vector';
import { GameField } from './game-field';

type ObjectsTypes = 'unknown' | 'block' | 'player';
type BlocColors = 'red' | 'blue' | 'green' | 'yellow';

export class GameObject<T> {
  type: ObjectsTypes = 'unknown';

  nextPosition: Vector | null;
  parent: GameField<T>;
  inMove = false;
  afterMovingAction: () => void;

  constructor(
    public id: string,
    public size: Vector,
    public position: Vector,
    public payload?: T
  ) { }

  getRect(): Rect {
    return new Rect(this.position, this.size.clone().add(-1));
  }

  goTo(nextPosition: Vector) {
    this.inMove = true;
    this.nextPosition = nextPosition;
    this.afterMovingAction = () => this.parent.addGravityMoveIdCan(this);
  }

  setParent(parent: GameField<T>) {
    this.parent = parent;
  }


  movingEnded() {
    this.inMove = false;
    if (this.afterMovingAction) {
      this.afterMovingAction();
      this.afterMovingAction = null;
    }
  }
}

export class BlockObject<T> extends GameObject<T> {
  type: ObjectsTypes = 'block';
  
  constructor(
    public id: string,
    public size: Vector,
    public position: Vector,
    public color: BlocColors,
    public payload?: T
  ) {
    super(id, size, position, payload);
  }
}

export class PaleyerObject<T> extends GameObject<T> {
  type: ObjectsTypes = 'player';
  inJump = false;
  afterJumpAction: () => void;

  jump() {
    if (this.inMove) { return; }
    this.inJump = true;
    this.goTo(this.position.clone().add(V(0, -64)));
  }

  movingEnded() {
    super.movingEnded();

    if (this.inJump) {
      this.inJump = false;
      if (this.afterJumpAction) {
        this.afterJumpAction();
        this.afterJumpAction = null;
      }
    }
  }

  moveRight() {
    this.horizontalMoving(V(1, 0), V(64, 0));
  }

  moveLeft() {
    this.horizontalMoving(V(-1, 0), V(-64, 0));
  }

  private horizontalMoving(direction: Vector, moving: Vector, force = false) {
    if (this.inJump && !this.afterJumpAction) {
      this.afterJumpAction = () => this.horizontalMoving(direction, moving, true);
    }

    if (this.inMove && !force) { return; }
    const { canFreeMove, blockers } = this.parent.checkMovingOpportunity(this, direction);

    if (canFreeMove) {
      this.goTo(this.position.clone().add(moving));
      return;
    }

    if (blockers.includes('overflow')) {
      return;
    }

    if (blockers.length === 1 && blockers[0] instanceof GameObject) {
      const blockMoveOpportunity = this.parent.checkMovingOpportunity(blockers[0], direction);
      if (blockMoveOpportunity.canFreeMove) {
        blockers[0].goTo(blockers[0].position.clone().add(moving));
        this.goTo(this.position.clone().add(moving));
      }
    }
  }
}