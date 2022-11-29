import { V } from './modules/shared/vector';

const TEXTURES_PATH = './assets/textures/';
const makeTexturePath = (name: string) => `${TEXTURES_PATH}${name}`;

export const TEXTURES = {
  blocks: {
    blue: makeTexturePath('block_blue.png'),
    green: makeTexturePath('block_green.png'),
    red: makeTexturePath('block_red.png'),
    yellow: makeTexturePath('block_yellow.png'),
  },
  back: makeTexturePath('back.png'),
  heroes: {
    hero1: makeTexturePath('hero_1.png')
  },
  flor: makeTexturePath('flow.png')
};

const BLOCK_SIZE = 64;
export const CONFIG = {
  BLOCK_SIZE: BLOCK_SIZE,
  CANVAS_SIZE: V(13, 10).multiply(BLOCK_SIZE),
  GAME_FIELD_POSIZITION: V(.5, 1).multiply(BLOCK_SIZE),
  GAME_FIELD_GRID_SIZE: V(12, 8)
}

