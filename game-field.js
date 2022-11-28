class GameFied {
  cahngeGameObjectPostionQueue = [];

  constructor(size, app) {
    this.app = app;
    this.size = size;
    const [columns, rows] = size;
    this.columns = new Array(columns).fill(0).map(() => new Array(rows).fill(null));

    this._processingCahngeGameObjectPostionQueue();
  }

  addGameObject(element, to) {
    this.app.stage.addChild(element.sprite);
    this.cahngeGameObjectPostionQueue.push({ to, element });
  }

  chageGameObjectPostion(from, to) {
    this.cahngeGameObjectPostionQueue.push({ from, to });
  }

  _processingCahngeGameObjectPostionQueue() {
    this.app.ticker.add(() => {
      while (this.cahngeGameObjectPostionQueue.length) {
        const moveInstruction = this.cahngeGameObjectPostionQueue.shift()
        let gameObj;
        if (moveInstruction.element) {
          gameObj = moveInstruction.element;
        } else {
          const [fromX, fromY] = moveInstruction.from;
          gameObj = this.columns[fromX][fromY];
          this.columns[fromX][fromY] = null;
        }

        const [toX, toY] = moveInstruction.to;
        this.columns[toX][toY] = gameObj;
      }
    })
  }

  forEach(callback) {
    this.columns.forEach((column, fieldX) => {
      column.forEach((item, fieldY) => {
        callback(column, item, fieldX, fieldY)
      })
    })
  }
}