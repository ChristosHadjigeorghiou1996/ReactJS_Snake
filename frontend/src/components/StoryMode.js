import React, { useState, useEffect } from 'react';
import Phaser from 'phaser';
import levels from './levels';

const StoryModeComponent = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return localStorage.getItem('highScore') || 0;
  });
  const [showGame, setShowGame] = useState(false);

  const startGame = () => {
    setShowGame(true);
  };

  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prevLevel => prevLevel + 1);
    } else {
      handleGameEnd();
    }
  };

  const handleGameEnd = () => {
    if (score > highScore) {
      localStorage.setItem('highScore', score);
      setHighScore(score);
    }
    setShowGame(false);
  };

  return (
    <div>
      {!showGame && (
        <div>
          <h2>Story Mode: {levels[currentLevel].name}</h2>
          <button onClick={startGame}>Start Level</button>
        </div>
      )}

      {showGame && (
        <div id="game-container">
          <PhaserGame
            levelConfig={levels[currentLevel]}
            score={score}
            setScore={setScore}
            onLevelEnd={nextLevel}
            onGameEnd={handleGameEnd}
          />
        </div>
      )}

      <div>
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
      </div>
    </div>
  );
};

const PhaserGame = ({ levelConfig, score, setScore, onLevelEnd, onGameEnd }) => {
  const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    parent: 'game-container',
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
  };

  const game = new Phaser.Game(config);
  let snake;
  let food;
  let cursors;
  let direction = 'RIGHT';
  let moveTimer = 0;

  function preload() {
    this.load.image('snake', 'assets/snake.png');
    this.load.image('food', 'assets/food.png');
    // Load other images as needed
  }

  function create() {
    snake = this.physics.add.group();
    food = this.physics.add.sprite(levelConfig.foodPosition.x, levelConfig.foodPosition.y, 'food');
    cursors = this.input.keyboard.createCursorKeys();

    // Create snake body
    snake.create(levelConfig.snakeStartPosition.x, levelConfig.snakeStartPosition.y, 'snake');

    // Create obstacles
    levelConfig.obstacles.forEach(obstacle => {
      this.add.rectangle(obstacle.x, obstacle.y, 20, 20, 0xffffff).setOrigin(0);
    });
  }

  function update(time) {
    if (time > moveTimer) {
      moveSnake();
      moveTimer = time + 150;
    }

    if (cursors.left.isDown && direction !== 'RIGHT') {
      direction = 'LEFT';
    } else if (cursors.right.isDown && direction !== 'LEFT') {
      direction = 'RIGHT';
    } else if (cursors.up.isDown && direction !== 'DOWN') {
      direction = 'UP';
    } else if (cursors.down.isDown && direction !== 'UP') {
      direction = 'DOWN';
    }

    this.physics.world.wrap(snake, 0, true);

    if (Phaser.Geom.Intersects.RectangleToRectangle(snake.getChildren()[0].getBounds(), food.getBounds())) {
      food.setPosition(levelConfig.foodPosition.x, levelConfig.foodPosition.y);
      const tail = snake.getChildren()[snake.getChildren().length - 1];
      snake.create(tail.x, tail.y, 'snake');
      setScore(prevScore => prevScore + 10);
    }

    levelConfig.obstacles.forEach(obstacle => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(snake.getChildren()[0].getBounds(), obstacle.getBounds())) {
        onGameEnd();
        break;
      }
    });
  }

  function moveSnake() {
    const head = snake.getChildren()[0];
    let newHeadX = head.x;
    let newHeadY = head.y;

    if (direction === 'LEFT') {
      newHeadX -= 20;
    } else if (direction === 'RIGHT') {
      newHeadX += 20;
    } else if (direction === 'UP') {
      newHeadY -= 20;
    } else if (direction === 'DOWN') {
      newHeadY += 20;
    }

    Phaser.Actions.ShiftPosition(snake.getChildren(), newHeadX, newHeadY);
  }

  return () => {
    game.destroy(true);
  };
};

export default StoryModeComponent;
