import React, { useState, useEffect } from 'react';

const HighScore = () => {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    fetchHighScores();
  }, []);

  const fetchHighScores = () => {
    fetch('http://localhost:3000/api/high-scores')
      .then(response => response.json())
      .then(data => setHighScores(data))
      .catch(error => console.error('Error fetching high scores:', error));
  };

  return (
    <div>
      <h2>High Scores</h2>
      <ul>
        {highScores.map((score, index) => (
          <li key={index}>{`${score.player}: ${score.score}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default HighScore;
