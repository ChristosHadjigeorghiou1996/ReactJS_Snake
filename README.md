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

If the user beats level 2 in story mode then they unlock the Head of Medusa item.

<img src="repo_assets/images/unlocking_head_of_medusa.png" alt="Level 2 is beaten. Head of Medusa is unlocked" width="600">

 * Now that lives are increased to 2, upon collision to an obstacle the user does not immediately die.
 * Instead the player lives are reduced by 1 and the snake immediately reverts direction to avoid further collision.

### Profile tab

Profile tab indicates the possible items that are available to the game.
* Name of item
* Information about the benefits provided when equipped
* the objective to complete to unlock each item

<img src="repo_assets/images/profile_equipped_items.png" alt="Profile items" width="600">

### Single player game
- Story mode
  - Incrementing levels of difficulty
  - Level 1 has to capture 5 food items with no obstacles
  - Level 2 has some obstacles and will unlock `Head of Medusa`
  - Level 3 has obstacles surrounding the screen to prevent crossover
  - Level 5 could be a boss and provide another item (Not implemented)
    - Move faster
    - Increase lives (pve instead of pvp?)
- High score mode

### Multiplayer (In Roadmap)

Users can compete in the same area to reach certain points first i.e. 100
- i.e. if user hits on other user or obstacle then deduction of 20 points would occur
- Items can help with preventing the point deduction and once used it is on cooldown until it recharges (?)
- Ranking mode where people of similar ranking play against each other and score points
- Weekly competitions

Feel free to send us for further information and contact us for suggestions!
