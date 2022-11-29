import { CONFIG } from '../../config';
import { GameField } from './game-field';
import { BlockObject, PaleyerObject } from './game-object';

export interface GameBlocksFactory<T> {
  subscribe(callbackFn: (nextBlock: BlockObject<T>) => void): void;
  destroy(): void;
}

export type GameConfig<T> = {
  heroes: PaleyerObject<T>[];
  blocksFactory: GameBlocksFactory<T>;
}

export class Game<T> {
  gameField: GameField<T>;
  constructor(public config: GameConfig<T>) {
    this.gameField = new GameField<T>(
      CONFIG.CANVAS_SIZE.clone().add(CONFIG.GAME_FIELD_POSIZITION.clone().multiply(-2)),
      CONFIG.GAME_FIELD_POSIZITION.clone(),
      CONFIG.BLOCK_SIZE,
      CONFIG.GAME_FIELD_GRID_SIZE.clone()
    );

    setTimeout(() => {
      this.gameField.addObject(config.heroes[0]);
      config.blocksFactory.subscribe(block => {
        this.gameField.addObject(block)
      });
    });
  }

  destroy() {
    this.gameField.destroy();
    this.config.blocksFactory.destroy();
  }
}