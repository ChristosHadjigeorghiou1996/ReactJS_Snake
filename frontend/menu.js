function startGame() {
    // Hide the menu and show the game container
    document.getElementById('menu').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
}

function viewHighScores() {
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
}
