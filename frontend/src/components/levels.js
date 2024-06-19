// levels.js

const levels = [
  {
    name: "Level 1",
    snakeStartPosition: { x: 100, y: 100 },
    foodPosition: {
      x: Phaser.Math.Between(0, 31) * 20,
      y: Phaser.Math.Between(0, 23) * 20,
    },
    obstacles: [],
    foodToConsume: 5,
  },
  {
    name: "Level 2",
    snakeStartPosition: { x: 200, y: 200 },
    foodPosition: {
      x: Phaser.Math.Between(0, 31) * 20,
      y: Phaser.Math.Between(0, 23) * 20,
    },
    obstacles: [
      { x: 200, y: 100 },
      { x: 200, y: 120 },
      { x: 200, y: 140 },
    ],
    foodToConsume: 10,
  },
];

export default levels;
