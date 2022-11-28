
class GameObject {
  constructor(gameField, sprite, position) {
    this.gameField = gameField;
    this.position = position;
    this.sprite = sprite;
    gameField.addGameObject(this, position);
  }

  getCoordsByPos(x, y) {
    return [x, y];
  }
}

class BlockObj extends GameObject {
  constructor(gameField, sprite, position) {
    super(gameField, sprite, position);
    sprite.width = BLOCK_SZIE;
    sprite.height = BLOCK_SZIE;

    const [x, y] = this.getCoordsByPos(position)
    sprite.position.x = x;
    sprite.position.y = y;
  }

  getCoordsByPos(position) {
    return [
      GAP_X + position[0] * BLOCK_SZIE,
      GAP_Y + position[1] * BLOCK_SZIE
    ]
  }
}

class PlayerObj extends GameObject {
  constructor(gameField, sprite, position) {
    super(gameField, sprite, position);

    const [x, y] = this.getCoordsByPos(position);
    sprite.width = BLOCK_SZIE;
    sprite.height = 2 * BLOCK_SZIE;
    sprite.position.x = x;
    sprite.position.x = y;

    this.afterJumpMove = null;
  }

  getCoordsByPos(position) {
    return [
      GAP_X + position[0] * BLOCK_SZIE,
      GAP_Y + position[1] * BLOCK_SZIE - BLOCK_SZIE
    ]
  }

  moveLeft(force) {
    if (this.inJump && !force && !this.afterJumpMove) {
      this.afterJumpMove = () => this.moveLeft(true);
    }

    if (this.inMove && !force) { return; }

    const [x, y] = this.position;

    if (x === 0) { return; }

    const columns = this.gameField.columns;

    if (!columns[x - 1][y] && !columns[x - + 1][y - 1]) {
      this.gameField.chageGameObjectPostion(this.position, [x - 1, y]);
    }
  }

  moveRight(force) {
    if (this.inJump && !force && !this.afterJumpMove) {
      this.afterJumpMove = () => this.moveRight(true);
    }

    if (this.inMove && !force) { return; }

    const [x, y] = this.position;

    console.log(this.pos);

    if (x === COLUMNS - 1) { return; }

    const columns = this.gameField.columns;

    if (!columns[x + 1][y] && !columns[x + 1][y - 1]) {
      this.gameField.chageGameObjectPostion(this.position, [x + 1, y]);
    }
  }

  jump() {
    if (this.inMove) { return; }
    const [x, y] = this.position;

    this.gameField.chageGameObjectPostion(this.position, [x, y - 1]);

    this.ignoreGravity = true;
    this.inJump = true;

    this.moveEndCallback = () => {
      this.moveEndCallback = null;
      this.ignoreGravity = false;
      this.inJump = false;
      if (this.afterJumpMove) {
        this.inMove = true;
        this.afterJumpMove();
        this.afterJumpMove = null;
      }
    }
  }
}