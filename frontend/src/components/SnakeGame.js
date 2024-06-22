import React, { useRef, useState, useEffect } from "react";
import Phaser from "phaser";
import "./SnakeGame.css";
import levels from "./levels";
import {GAME_WIDTH, GAME_HEIGHT, CELL_SIZE} from "./constants"

const SnakeGame = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const storedHighScore = localStorage.getItem("highScore");
    return storedHighScore ? parseInt(storedHighScore, 10) : 0;
  });
  const [gameStarted, setGameStarted] = useState(false);
  const [showNextLevelScreen, setShowNextLevelScreen] = useState(false);
  const [showLoseScreen, setShowLoseScreen] = useState(false);
  const [showKeyBindings, setShowKeyBindings] = useState(false);
  const [showHighScores, setShowHighScores] = useState(false);
  const [highScores, setHighScores] = useState([]);

  const [currentLevel, setCurrentLevel] = useState(1);
  const [storyMode, setStoryMode] = useState(false);
  const [foodsConsumed, setFoodsConsumed] = useState(0);

  const pausedRef = useRef(false);
  const directionRef = useRef("RIGHT");

  useEffect(() => {
    let game;

    if (gameStarted) {
      const config = {
        type: Phaser.AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        parent: "game-container",
        scene: {
          preload: preload,
          create: create,
          update: update,
        },
        physics: {
          default: "arcade",
          arcade: {
            debug: false,
          },
        },
      };

      game = new Phaser.Game(config);
      let snakeGroup;
      let foodGroup;
      let obstacleGroup;
      let cursors;
      let currentStageLevel = storyMode ? levels[currentLevel - 1] : levels[0];

      function preload() {
        this.load.image("snake", "/assets/snake.png");
        this.load.image("food", "/assets/food.png");
        this.load.image("obstacle", "/assets/obstacle.png");
      }

      function create() {
        cursors = this.input.keyboard.createCursorKeys();
        // quit
        this.input.keyboard.on("keydown-Q", quitGame, this);
        // pause
        this.input.keyboard.on("keydown-P", togglePause, this);
        // prevent going in reverse direction from current direction
        this.input.keyboard.on("keydown-LEFT", () => {
          if (directionRef.current !== "RIGHT") {
            directionRef.current = "LEFT";
          }
        });
        this.input.keyboard.on("keydown-RIGHT", () => {
          if (directionRef.current !== "LEFT") {
            directionRef.current = "RIGHT";
          }
        });
        this.input.keyboard.on("keydown-UP", () => {
          if (directionRef.current !== "DOWN") {
            directionRef.current = "UP";
          }
        });
        this.input.keyboard.on("keydown-DOWN", () => {
          if (directionRef.current !== "UP") {
            directionRef.current = "DOWN";
          }
        });
        snakeGroup = this.physics.add.group();
        const snakeHead = snakeGroup.create(
          currentStageLevel.snakeStartPosition.x,
          currentStageLevel.snakeStartPosition.y,
          "snake"
        );
        snakeHead.setOrigin(0);

        foodGroup = this.physics.add.group();
        const food = foodGroup.create(
          currentStageLevel.foodPosition.x,
          currentStageLevel.foodPosition.y,
          "food"
        );
        food.setOrigin(0);

        obstacleGroup = this.physics.add.group();
        currentStageLevel.obstacles.forEach((obstacle) => {
          obstacleGroup.create(obstacle.x, obstacle.y, "obstacle");
        });

        this.physics.add.collider(
          snakeGroup,
          obstacleGroup,
          snakeCollision,
          null,
          this
        );
        this.physics.add.collider(
          snakeGroup,
          foodGroup,
          foodCollision,
          null,
          this
        );
        this.physics.add.collider(
          foodGroup,
          obstacleGroup,
          handleFoodObstacleCollision,
          null,
          this
        );
      }

      function update() {
        const snakeHead = snakeGroup.getChildren()[0];

        if (!pausedRef.current && snakeHead) {
          const speed = 150;
          if (directionRef.current === "LEFT") snakeHead.setVelocity(-speed, 0);
          else if (directionRef.current === "RIGHT")
            snakeHead.setVelocity(speed, 0);
          else if (directionRef.current === "UP")
            snakeHead.setVelocity(0, -speed);
          else if (directionRef.current === "DOWN")
            snakeHead.setVelocity(0, speed);

          const snakeSegments = snakeGroup.getChildren();
          for (let i = snakeSegments.length - 1; i > 0; i--) {
            snakeSegments[i].x = snakeSegments[i - 1].x;
            snakeSegments[i].y = snakeSegments[i - 1].y;
          }

          this.physics.world.wrap(snakeHead, 0);
          this.physics.world.wrap(snakeGroup, 0);

          if (this.pauseText) {
            this.pauseText.destroy();
            this.pauseText = null;
          }
        } else if (snakeHead) {
          snakeHead.setVelocity(0);
          if (!this.pauseText) {
            this.pauseText = this.add
              .text(
                GAME_WIDTH / 2,
                GAME_HEIGHT / 2,
                "Paused\nPress P to continue",
                { fontFamily: "Arial", fontSize: 48, color: "#ff0000" }
              )
              .setOrigin(0.5);
          }
        }
      }

      function snakeCollision() {
        setShowLoseScreen(true);
        handleGameEnd();
      }

      function handleFoodObstacleCollision(food, obstacle) {
        food.destroy();
        spawnFood();
      }

      function foodCollision(snakeHead, food) {
        increaseScore();
        food.destroy();
        spawnFood();
        growSnake();
      }

      const increaseScore = () => {
        setFoodsConsumed((prevFoodsConsumed) => {
          const newFoodsConsumed = prevFoodsConsumed + 1;
          updateDisplayText(newFoodsConsumed, currentStageLevel.foodToConsume);
          checkIfLevelCompleted(newFoodsConsumed);
          return newFoodsConsumed;
        });
      };

      function checkIfLevelCompleted(foodsConsumed) {
        if (foodsConsumed === currentStageLevel.foodToConsume) {
          if (currentLevel < levels.length) {
            setShowNextLevelScreen(true);
            setGameStarted(false);
          } else {
            alert("Congratulations! You have completed the story mode!");
            quitGame();
          }
        }
      }

      function spawnFood() {
        let x, y, overlappingObstacle, overlappingSnake;
        do {
          x = Phaser.Math.Between(1, GAME_WIDTH / CELL_SIZE - 1) * CELL_SIZE;
          y = Phaser.Math.Between(1, GAME_HEIGHT / CELL_SIZE - 1) * CELL_SIZE;
          overlappingObstacle = obstacleGroup
            .getChildren()
            .some((obstacle) => obstacle.x === x && obstacle.y === y);
          overlappingSnake = snakeGroup
            .getChildren()
            .some((snake) => snake.x === x && snake.y === y);
        } while (overlappingSnake || overlappingObstacle);

        const newFood = foodGroup.create(x, y, "food");
        newFood.setOrigin(0);
      }

      function growSnake() {
        const snakeSegments = snakeGroup.getChildren();
        if (snakeSegments.length === 0) return;

        const lastSegment = snakeSegments[snakeSegments.length - 1];
        let newSegmentX = lastSegment.x;
        let newSegmentY = lastSegment.y;

        switch (directionRef.current) {
          case "LEFT":
            newSegmentX += CELL_SIZE;
            break;
          case "RIGHT":
            newSegmentX -= CELL_SIZE;
            break;
          case "UP":
            newSegmentY += CELL_SIZE;
            break;
          case "DOWN":
            newSegmentY -= CELL_SIZE;
            break;
          default:
            break;
        }

        // if (lastSegment) {
        //   snakeGroup.create(newSegmentX.x, newSegmentY.y, "snake").setOrigin(0);
        // Create new segment
        const newSegment = snakeGroup
          .create(newSegmentX, newSegmentY, "snake")
          .setOrigin(0);

        // Add some distance between segments
        if (snakeSegments.length > 0) {
          const previousSegment = snakeSegments[snakeSegments.length - 2];
          if (
            directionRef.current === "LEFT" ||
            directionRef.current === "RIGHT"
          ) {
            newSegment.x =
              previousSegment.x + (directionRef.current === "LEFT" ? 1 : -1);
            newSegment.y = previousSegment.y;
          } else if (
            directionRef.current === "UP" ||
            directionRef.current === "DOWN"
          ) {
            newSegment.x = previousSegment.x;
            newSegment.y =
              previousSegment.y + directionRef.current === "UP" ? 1 : -1;
          }
        }
      }

      function quitGame() {
        game.destroy(true);
        handleGameEnd();
      }

      function togglePause() {
        pausedRef.current = !pausedRef.current;
      }

      return () => {
        if (game) {
          game.destroy(true);
        }
      };
    }
  }, [gameStarted]);

  const handleGameEnd = () => {
    if (!storyMode) {
      if (score > highScore) {
        localStorage.setItem("highScore", score);
        setHighScore(score);
      }
      setScore(0);
    } else {
      setCurrentLevel(0);
    }
    setGameStarted(false);
    document.getElementById("menu").style.display = "block";
    document.getElementById("game-container").style.display = "none";
  };

  const startStoryMode = () => {
    setStoryMode(true);
    setGameStarted(true);
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  };

  const startHighScoreMode = () => {
    setStoryMode(false);
    setGameStarted(true);
    document.getElementById("menu").style.display = "none";
    document.getElementById("game-container").style.display = "block";
  };

  function updateDisplayText(foodsConsumed, valueToDisplay) {
    const displayText = storyMode
      ? `Food: ${foodsConsumed}/${valueToDisplay}`
      : `Score: ${foodsConsumed * 10}`;
    if (storyMode) {
      if (document.getElementById("food-text")) {
        document.getElementById("food-text").innerText = displayText;
      }
    } else {
      document.getElementById("food-text").innerText = displayText;
    }
  }

  const proceedToNextLevel = () => {
    setShowNextLevelScreen(false);
    setCurrentLevel((prevLevel) => prevLevel + 1);
    setFoodsConsumed(0);
    setGameStarted(true);
    updateDisplayText(0, levels[currentLevel - 1].foodToConsume);
  };

  const restartLevel = () => {
    setShowLoseScreen(false);
    setGameStarted(true);
    setFoodsConsumed(0);
    if (storyMode) {
      setStoryMode(true);
    } else {
      setStoryMode(false);
    }
    updateDisplayText(0, levels[currentLevel - 1].foodToConsume);
  };

  const goToMainMenu = () => {
    setShowLoseScreen(false);
    setStoryMode(false);
    setGameStarted(false);
    document.getElementById('menu').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
  };

  const fetchHighScores = () => {
    fetch("http://localhost:3000/api/high-scores")
      .then((response) => response.json())
      .then((data) => setHighScores(data))
      .catch((error) => console.error("Error fetching high scores:", error));
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
          onClick={startHighScoreMode}
        >
          High score mode
        </button>
        <button
          className="btn btn-success custom-button"
          onClick={startStoryMode}
        >
          Story mode
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
      <div id="game-container-wrapper">
        <div id="game-container">
      </div>
    </div>
      {showNextLevelScreen && (
        <div className="next-level-screen" onClick={proceedToNextLevel}>
          <h1>Level {currentLevel} Completed!</h1>
          <p>Click to proceed to the next level</p>
        </div>
      )}
      {showLoseScreen && (
        <div className="lose-screen" onClick={goToMainMenu}>
          <h1>Game Over!</h1>
          <p>Click to return to main menu</p>
        </div>
      )}
      {!storyMode && gameStarted && (
        <div className="scoreboard">
          <div id="food-text">Score: {score}</div>
          <div id="level-text">High Score: {highScore}</div>
        </div>
      )}
      {storyMode && gameStarted && (
        <div className="scoreboard">
          <div id="food-text">
            Food: {foodsConsumed}/{levels[currentLevel - 1].foodToConsume}
          </div>
          <div id="level-text">Level: {currentLevel}</div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
