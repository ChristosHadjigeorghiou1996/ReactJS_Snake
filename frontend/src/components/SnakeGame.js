import React, { useEffect, useState } from "react";
import Phaser from "phaser";
import "./SnakeGame.css"; // Import your CSS file for additional styling

const SnakeGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return localStorage.getItem("highScore") || 0;
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [gameInstance, setGameInstance] = useState(null);
  const [showKeyBindings, setShowKeyBindings] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    let game;

    if (gameStarted) {
      const config = {
        type: Phaser.AUTO,
        width: 640,
        height: 480,
        parent: "game-container",
        scene: {
          preload: preload,
          create: create,
          update: update,
          extend: {
            restartGame: restartGame,
          },
        },
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
      };

      game = new Phaser.Game(config);
      setGameInstance(game);

      let snake;
      let food;
      let cursors;
      let direction = "RIGHT";
      let moveTimer = 0;
      let isPaused = false;

      function preload() {
        this.load.image("snake", "assets/snake.png");
        this.load.image("food", "assets/food.png");
      }

      function create() {
        snake = this.physics.add.group();
        food = this.physics.add.sprite(
          Phaser.Math.Between(0, 31) * 20,
          Phaser.Math.Between(0, 23) * 20,
          "food"
        );
        cursors = this.input.keyboard.createCursorKeys();

        this.input.keyboard.on('keydown-Q', quitGame, this);
        this.input.keyboard.on('keydown-P', togglePause, this);

        // Create initial snake body
        for (let i = 0; i < 3; i++) {
          snake.create(100 - i * 20, 100, "snake");
        }
      }

      function update(time) {
        if (isPaused) {
          return;
        }

        if (time > moveTimer) {
          moveSnake();
          moveTimer = time + 150;
        }

        if (
          Phaser.Geom.Intersects.RectangleToRectangle(
            snake.getChildren()[0].getBounds(),
            food.getBounds()
          )
        ) {
          food.setPosition(
            Phaser.Math.Between(0, 31) * 20,
            Phaser.Math.Between(0, 23) * 20
          );
          const tail = snake.getChildren()[snake.getChildren().length - 1];
          snake.create(tail.x, tail.y, "snake");
          setScore((prevScore) => prevScore + 10);
        }

        // Check for self-collision
        for (let i = 1; i < snake.getChildren().length; i++) {
          if (
            Phaser.Geom.Intersects.RectangleToRectangle(
              snake.getChildren()[0].getBounds(),
              snake.getChildren()[i].getBounds()
            )
          ) {
            if (score > highScore) {
              localStorage.setItem("highScore", score);
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

        if (direction === "LEFT") {
          newHeadX -= 20;
        } else if (direction === "RIGHT") {
          newHeadX += 20;
        } else if (direction === "UP") {
          newHeadY -= 20;
        } else if (direction === "DOWN") {
          newHeadY += 20;
        }

        // Move the body
        Phaser.Actions.ShiftPosition(snake.getChildren(), newHeadX, newHeadY);
      }

      function restartGame() {
        snake.clear(true, true);
        food.setPosition(
          Phaser.Math.Between(0, 31) * 20,
          Phaser.Math.Between(0, 23) * 20
        );
        direction = "RIGHT";
        for (let i = 0; i < 3; i++) {
          snake.create(100 - i * 20, 100, "snake");
        }
      }

      function quitGame() {
        game.destroy(true);
        setGameStarted(false);
        document.getElementById("menu").style.display = "block";
        document.getElementById("game-container").style.display = "none";
      }

      function togglePause() {
        isPaused = !isPaused;
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
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  };

  const fetchHighScores = () => {
    fetch("http://localhost:3000/api/high-scores")
      .then((response) => response.json())
      .then((data) => {
        setHighScores(data);
      })
      .catch((error) =>
        console.error("Error fetching high scores:", error)
      );
  };

  const toggleKeyBindings = () => {
    setShowKeyBindings(!showKeyBindings);
  };

  const toggleHighScores = () => {
    setShowHighScores(!showHighScores);
    if (!showHighScores) {
      fetchHighScores();
    }
  };

  return (
    <div className="container">
      <h1>Snake Game</h1>
      <div id="menu">
        <button
          className="btn btn-primary custom-button"
          onClick={startGame}
        >
          Start Game
        </button>
        <button
          className="btn btn-secondary custom-button"
          onClick={toggleHighScores}
        >
          {showHighScores ? "Hide High Scores" : "View High Scores"}
        </button>
        <button
          className="btn btn-info custom-button"
          onClick={toggleKeyBindings}
        >
          {showKeyBindings ? "Hide Key Bindings" : "Show Key Bindings"}
        </button>
        {showKeyBindings && (
          <div className="key-bindings">
            <h3>Key Bindings</h3>
            <ul>
              <li>
                <strong>Arrow Keys:</strong> Move Snake
              </li>
              <li>
                <strong>Q:</strong> Quit Game
              </li>
              <li>
                <strong>P:</strong> Pause/Resume Game
              </li>
            </ul>
          </div>
        )}
        {showHighScores && (
          <div className="high-scores">
            <h3>High Scores</h3>
            <ul>
              {highScores.map((score, index) => (
                <li key={index}>
                  Player: {score.player}, Score: {score.score}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div
        id="game-container"
        style={{ display: "none", width: "640px", height: "480px" }}
      ></div>
      <div className="scoreboard">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
      </div>
    </div>
  );
};

export default SnakeGame;
