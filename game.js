const app = new PIXI.Application({ width: BLOCK_SZIE * 13, height: BLOCK_SZIE * 10 });
document.body.appendChild(app.view);

const G = BLOCK_SZIE / 20;

function getDirection(cuurent, needed) {
  return Math.abs(needed - cuurent) / (needed - cuurent);
}

const gf = new GameFied([COLUMNS, ROWS], app);

app.ticker.add(delta => {
  gf.forEach((column, item, fieldX, fieldY) => {
    if (!item) { return; }
    item.position = [fieldX, fieldY];
    if (item.ignoreGravity || item.inMove) { return; }

    if (fieldY < ROWS - 1 && !column[fieldY + 1]) {
      column[fieldY] = null;
      column[fieldY + 1] = item;
      item.inMove = true;
    }
  })

  gf.forEach((_column, item, fieldX, fieldY) => {
    if (!item) { return; }
    const [x, y] = item.getCoordsByPos([fieldX, fieldY]);

    item.inMove = false;

    if (Math.abs(item.sprite.y - y) > G) {
      item.sprite.y += G * delta * getDirection(item.sprite.y, y);
      item.inMove = true;
    } else {
      item.sprite.y = y;
    }

    if (Math.abs(item.sprite.x - x) > G) {
      item.inMove = true;
      item.sprite.x += G * delta * getDirection(item.sprite.x, x);
    } else {
      item.sprite.x = x;
    }

    if (!item.inMove && item.moveEndCallback) {
      item.moveEndCallback()
    }
  })

});

const player = new PlayerObj(gf, PIXI.Sprite.from(TEXTURES.heroes.hero1), [0, 0]);


setInterval(() => {
  const color = ['red', 'blue', 'yellow', 'green'].sort(() => Math.random() - .5)[0];
  new BlockObj(gf, PIXI.Sprite.from(TEXTURES.blocks[color]), [Math.round(Math.random() * (COLUMNS - 1)), 0]);
}, 2000);

document.addEventListener('keydown', e => {
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
