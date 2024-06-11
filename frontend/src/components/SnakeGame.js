import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';

const SnakeGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return localStorage.getItem('highScore') || 0;
  });
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    let game;

    if (gameStarted) {
      const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        parent: 'game-container',
        scene: {
          preload: preload,
          create: create,
          update: update,
          extend: {
            restartGame: restartGame,
          },
        },
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
          },
        },
      };

      game = new Phaser.Game(config);

      let snake;
      let food;
      let cursors;
      let direction = 'RIGHT';
      let moveTimer = 0;

      function preload() {
        this.load.image('snake', 'assets/snake.png');
        this.load.image('food', 'assets/food.png');
      }

      function create() {
        snake = this.physics.add.group();
        food = this.physics.add.sprite(Phaser.Math.Between(0, 31) * 20, Phaser.Math.Between(0, 23) * 20, 'food');
        cursors = this.input.keyboard.createCursorKeys();
        
        // Create initial snake body
        for (let i = 0; i < 3; i++) {
          snake.create(100 - i * 20, 100, 'snake');
        }

        // Display score text
        this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#fff' });
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

        // Check for collisions
        this.physics.world.wrap(snake, 0, true);

        if (Phaser.Geom.Intersects.RectangleToRectangle(snake.getChildren()[0].getBounds(), food.getBounds())) {
          food.setPosition(Phaser.Math.Between(0, 31) * 20, Phaser.Math.Between(0, 23) * 20);
          const tail = snake.getChildren()[snake.getChildren().length - 1];
          snake.create(tail.x, tail.y, 'snake');
          setScore(prevScore => prevScore + 10);
        }

        // Check for self-collision
        for (let i = 1; i < snake.getChildren().length; i++) {
          if (Phaser.Geom.Intersects.RectangleToRectangle(snake.getChildren()[0].getBounds(), snake.getChildren()[i].getBounds())) {
            if (score > highScore) {
              localStorage.setItem('highScore', score);
              setHighScore(score);
            }
            restartGame();
            setScore(0);
          }
        }
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

        // Move the body
        Phaser.Actions.ShiftPosition(snake.getChildren(), newHeadX, newHeadY);
      }

      function restartGame() {
        snake.clear(true, true);
        food.setPosition(Phaser.Math.Between(0, 31) * 20, Phaser.Math.Between(0, 23) * 20);
        direction = 'RIGHT';
        for (let i = 0; i < 3; i++) {
          snake.create(100 - i * 20, 100, 'snake');
        }
      }

      return () => {
        if (game) {
          game.destroy(true);
        }
      };
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true); // Set gameStarted to true to start the game
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
  };

  const viewHighScores = () => {
    fetch('http://localhost:3000/api/high-scores')
      .then(response => response.json())
      .then(data => {
        let highScores = 'High Scores:\n';
        data.forEach(score => {
          highScores += `Player: ${score.player}, Score: ${score.score}\n`;
        });
        alert(highScores);
      })
      .catch(error => console.error('Error fetching high scores:', error));
  };

  return (
    <div>
      <div id="menu">
        <h1>Snake Game</h1>
        <button onClick={startGame}>Start Game</button>
        <button onClick={viewHighScores}>View High Scores</button>
      </div>
      <div id="game-container" style={{ display: 'none', width: '640px', height: '480px' }}></div>
      <div>Score: {score}</div>
      <div>High Score: {highScore}</div>
    </div>
  );
};

export default SnakeGame;
