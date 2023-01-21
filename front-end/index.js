let H = 720,
  W = 900,
  grid = H / 12;

let app = new PIXI.Application({
  height: H,
  width: W,
  backgroundColor: "black",
});

document.getElementById("root").appendChild(app.view);

let BG = new PIXI.Sprite(PIXI.Texture.from("assets/map.png"));
(BG.height = H), (BG.width = W);
app.stage.addChild(BG);

let elapsed = 0.0;

let planeInit = [
  { loc: { x: 12, y: 0.5 }, file: "up" },
  { loc: { x: 12, y: 3 }, file: "right" },
  { loc: { x: 12, y: 6 }, file: "down" },
  { loc: { x: 12, y: 8.5 }, file: "left" },
];

let planeShape = [
  [
    [0, 0, 2, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 0],
    [1, 0, 1, 0],
    [1, 1, 1, 2],
    [1, 0, 1, 0],
    [0, 0, 1, 0],
  ],
  [
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 2, 0, 0],
  ],
  [
    [0, 1, 0, 0],
    [0, 1, 0, 1],
    [2, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 0, 0],
  ],
];

class Plane {
  sprite;
  type;
  initial = true;

  constructor(type) {
    this.type = type;
    this.sprite = new PIXI.Sprite(
      PIXI.Texture.from(`assets/plane-${planeInit[type].file}.png`)
    );
    this.sprite.interactive = true;
    this.sprite.on("pointerdown", onDragStart, this);
    this.sprite.x = planeInit[type].loc.x * grid;
    this.sprite.y = planeInit[type].loc.y * grid;

    this.sprite.height = (planeShape[this.type].length / 2) * grid;
    this.sprite.width = (planeShape[this.type][0].length / 2) * grid;

    app.stage.addChild(this.sprite);
  }
}

for (let i = 0; i < 4; i++) new Plane(i);

let gameMap = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

let dragTarget = null;
let dragDifSet = false;
let dragDif = { x: 0, y: 0 };

app.stage.interactive = true;
app.stage.hitArea = app.screen;
app.stage.on("pointerup", onDragEnd);
app.stage.on("pointerupoutside", onDragEnd);

function findNear(pos) {
  return Math.floor(pos / grid + 0.5) * grid;
}

function targetValid(x, y, type) {
  x = findNear(x) / grid;
  y = findNear(y) / grid;

  if (
    x < 1 ||
    x + planeShape[type][0].length - 1 > 10 ||
    y < 1 ||
    y + planeShape[type].length - 1 > 10
  )
    return false;
  x--;
  y--;

  for (let i = 0; i < planeShape[type].length; i++)
    for (let j = 0; j < planeShape[type][0].length; j++) {
      if (planeShape[type][i][j] == 0) continue;
      if (gameMap[i + y][j + x] != 0) return false;
    }
  return true;
}

function placePlane(x, y, type, mult) {
  for (let i = 0; i < planeShape[type].length; i++)
    for (let j = 0; j < planeShape[type][0].length; j++)
      gameMap[i + y][j + x] += planeShape[type][i][j] * mult;
}

function onDragMove(event) {
  if (dragTarget) {
    let tmp;
    tmp = dragTarget.sprite.parent.toLocal(event.global);
    if (!dragDifSet) {
      dragDif.x = dragTarget.sprite.x - tmp.x;
      dragDif.y = dragTarget.sprite.y - tmp.y;
      dragDifSet = true;
    }
    dragTarget.sprite.x = tmp.x + dragDif.x;
    dragTarget.sprite.y = tmp.y + dragDif.y;
  }
}

let planeCount = 0;

function onDragStart() {
  if (this.initial) {
    if (planeCount >= 3) return;
    planeCount++;
    new Plane(this.type);
    this.sprite.height *= 2;
    this.sprite.width *= 2;
    this.sprite.x -= this.sprite.height / 4;
    this.sprite.y -= this.sprite.height / 4;
    this.initial = false;
  } else {
    placePlane(
      this.sprite.x / grid - 1,
      this.sprite.y / grid - 1,
      this.type,
      -1
    );
  }
  this.sprite.alpha = 0.5;
  dragTarget = this;
  app.stage.on("pointermove", onDragMove);
}

function onDragEnd() {
  dragDifSet = false;
  dragDif.x = 0;
  dragDif.y = 0;
  if (dragTarget) {
    app.stage.off("pointermove", onDragMove);
    if (
      !targetValid(dragTarget.sprite.x, dragTarget.sprite.y, dragTarget.type)
    ) {
      dragTarget.sprite.parent.removeChild(dragTarget.sprite);
      dragTarget.sprite.destroy();
      planeCount--;
      dragTarget = null;
      return;
    }

    dragTarget.sprite.x = findNear(dragTarget.sprite.x);
    dragTarget.sprite.y = findNear(dragTarget.sprite.y);
    dragTarget.sprite.alpha = 1;
    placePlane(
      dragTarget.sprite.x / grid - 1,
      dragTarget.sprite.y / grid - 1,
      dragTarget.type,
      1
    );
    dragTarget = null;
  }
}

app.ticker.add((delta) => {
  elapsed += delta;
});
