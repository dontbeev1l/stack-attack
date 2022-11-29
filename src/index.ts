import { Application, Sprite } from 'pixi.js';
import { CONFIG, TEXTURES } from './config';
import { V } from './modules/shared/vector';
import { Game, GameBlocksFactory } from './modules/stack/game';
import { IGFChangeEvent } from './modules/stack/game-field';
import { BlockObject, PaleyerObject } from './modules/stack/game-object';



const app = new Application({ width: CONFIG.CANVAS_SIZE.width, height: CONFIG.CANVAS_SIZE.height });
document.body.appendChild(app.view as HTMLCanvasElement);

class DefaultBlocksFactory<Sprite> implements GameBlocksFactory<Sprite> {
  callbackFn: (nextBlock: BlockObject<Sprite>) => void;
  intervalId: number;

  subscribe(callbackFn: (nextBlock: BlockObject<Sprite>) => void): void {
    this.callbackFn = callbackFn;
    this.startGeenration()
  }

  startGeenration() {
    this.intervalId = setInterval(() => {
      const color: keyof typeof TEXTURES.blocks = Object.keys(TEXTURES.blocks).sort(() => Math.random() - .5)[0] as any;
      const sprite2 = Sprite.from(TEXTURES.blocks[color]);
      const position = new Array(CONFIG.GAME_FIELD_GRID_SIZE.width).fill(0).map((_v, i) => i).sort(() => Math.random() - .5)[0];
      const gO2 = new BlockObject(color + '_' + Date.now(), V(1, 1).multiply(CONFIG.BLOCK_SIZE), V(position * CONFIG.BLOCK_SIZE, 0), color, sprite2);
      this.callbackFn(gO2 as any);
    }, 2000) as any;
  }

  destroy() {
    clearInterval(this.intervalId);
  }
}


function startGame() {
  const player = new PaleyerObject('palyer_' + Date.now(), V(1, 2).multiply(CONFIG.BLOCK_SIZE), V(0, 0), Sprite.from(TEXTURES.heroes.hero1));

  const game = new Game({
    heroes: [player],
    blocksFactory: new DefaultBlocksFactory<Sprite>()
  });

  game.gameField.changes$.subscribe((change: IGFChangeEvent<Sprite>) => {
    if (change.type === 'destroyed') {
      app.stage.removeChild(change.obj.payload);
      return;
    }

    if (change.type === 'created') {
      app.stage.addChild(change.obj.payload);
    }

    change.obj.payload.width = change.obj.size.x;
    change.obj.payload.height = change.obj.size.y;
    change.obj.payload.x = change.obj.position.x;
    change.obj.payload.y = change.obj.position.y;
  });

  return { game, player };
}


function addKeyboardController<T>(player: PaleyerObject<T>) {
  const KEY_ARROW_LEFT = 'ArrowLeft';
  const KEY_ARROW_RIGHT = 'ArrowRight';
  const KEY_ARROR_UP = 'ArrowUp'

  document.addEventListener('keydown', e => {
    console.log(e);
    switch (e.code) {
      case KEY_ARROW_RIGHT:
        player.moveRight();
        break;
      case KEY_ARROW_LEFT:
        player.moveLeft();
        break;
      case KEY_ARROR_UP:
        player.jump();
        break;
      default:
        break;
    }
  })
}

let currentGame: Game<Sprite>;

document.getElementById('start').addEventListener('click', () => {
  if (currentGame) { currentGame.destroy(); }
  const { game, player } = startGame();
  addKeyboardController(player);
  currentGame = game;
})