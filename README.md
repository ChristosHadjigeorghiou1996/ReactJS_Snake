# ReactJS_Snake

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Traditional snake game with js and react

## Requirements
1)  Navigate to `./backend/` and run `npm install`.
2) Once done, run `node server.js` and check it is successfully running
3) Go to `http://localhost:3000/api/high-scores` and check the json 
4) In terminal, go to `./frontend/` and run `npm install`.
5) Once done, run `npm start` and open `http://localhost:3001` or the chosen port
6) Ensure there is a menu as shown below:

<img src="repo_assets/images/home_screen.png" alt="Home screen image" width="600">

## Features

Can toggle the high scores and key bindings by toggling on the main menu

<img src="repo_assets/images/toggled_high_score_and_key_bindings.png" alt="Toggled high scores and key bindings image" width="600">


Each time a level is passed the success screen is rendered:

<img src="repo_assets/images/successful_level.png" alt="Level completed, click to proceed" width="600">

Each time a level or high score mode fails the game over screen is rendered:

<img src="repo_assets/images/level_failed.png" alt="Game over, click to proceed" width="600">



### Single player game
- Story mode
  - Incrementing levels of difficulty
  - Level 1 has to capture 5 food items with no obstacles
  - Level 2 has some obstacles
  - Level 5 could get an item
    - Move faster
    - Increase lives (pve instead of pvp?)
    - Reduce deduction of points (pvp?)
    - Could have items that have different effect on each mode ? 
- High score mode

### Multiplayer (In Roadmap)

Users can compete in the same area to reach certain points first i.e. 100
- i.e. if user hits on other user or obstacle then deduction of 20 points would occur
- Items can help with preventing the point deduction and once used it is on cooldown until it recharges (?)

Feel free to send us for further information and contact us for suggestions!