const express = require('express');
const app = express();
const cors = require('cors');
// Enable all CORS requests
app.use(cors());
const port = 3000;

// Dummy high scores data
const highScores = [
    { player: 'Alice', score: 120 },
    { player: 'Bob', score: 100 },
    { player: 'Charlie', score: 80 },
];

app.use(express.static('frontend'));

app.get('/api/high-scores', (req, res) => {
    res.json(highScores);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
