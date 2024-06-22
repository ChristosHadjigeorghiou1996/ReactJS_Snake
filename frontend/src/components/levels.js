import {CELL_SIZE, GAME_HEIGHT, GAME_WIDTH} from "./constants"

const levels = [
  {
    name: "Level 1",
    snakeStartPosition: { x: 100, y: 100 },
    foodPosition: {
      x: Phaser.Math.Between(1, GAME_WIDTH / CELL_SIZE - 1) * CELL_SIZE,
      y: Phaser.Math.Between(1, GAME_HEIGHT / CELL_SIZE - 1) * CELL_SIZE
    },
    obstacles: [],
    foodToConsume: 5,
  },
  {
    name: "Level 2",
    snakeStartPosition: { x: 300, y: 300 },
    foodPosition: {
      x: Phaser.Math.Between(1, GAME_WIDTH / CELL_SIZE - 1) * CELL_SIZE,
      y: Phaser.Math.Between(1, GAME_HEIGHT / CELL_SIZE - 1) * CELL_SIZE
    },
    obstacles: [
      { x: 200, y: 100 },
      { x: 200, y: 120 },
      { x: 200, y: 140 },
    ],
    foodToConsume: 7,
  },
  {
    name: "Level 3",
    snakeStartPosition: { x: 200, y: 200 },
    foodPosition: {
      x: Phaser.Math.Between(1, GAME_WIDTH / CELL_SIZE - 1) * CELL_SIZE,
      y: Phaser.Math.Between(1, GAME_HEIGHT / CELL_SIZE - 1) * CELL_SIZE
    },
    obstacles: borderObstacles(),
    foodToConsume: 10,
  },
];

function borderObstacles() {
  const obstacles = [];
  for (let x = 0; x < GAME_WIDTH; x += CELL_SIZE) {
    obstacles.push({ x: x, y: 0 });
    obstacles.push({ x: x, y: GAME_HEIGHT - CELL_SIZE });
  }
  for (let y = 0; y < GAME_HEIGHT; y += CELL_SIZE) {
    obstacles.push({ x: 0, y: y });
    obstacles.push({ x: GAME_WIDTH - CELL_SIZE, y: y });
  }
  return obstacles;
}

export default levels;
