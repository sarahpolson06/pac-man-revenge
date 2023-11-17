# Pac-Man Game

This Pac-Man game is a classic implementation using HTML5 canvas and JavaScript. It offers multiple levels, each presenting unique challenges such as avoiding ghosts, collecting good food for points, and dealing with bad food that reduces points.

## Getting Started

To start playing the game, simply open the `index.html` file in a web browser. Click the "Start" button to initiate the game. Control Pac-Man's movement using the mouse. Additionally, press the "Escape" key to pause the game, and use "1" to resume or "2" to quit.

## Game Elements

### Pac-Man
- Main character controlled with the mouse.
- Collect good food to earn points.
- Avoid ghosts and bad food to prevent point deduction.

### Ghosts
- Enemies that move towards Pac-Man.
- Collision with a ghost results in the end of the game.

### Food
- Good food: Collect to earn points.
- Bad food: Avoid to prevent point deduction.

### Levels
- Multiple levels with increasing challenges.
- Introduces different types of food and enemies.

## Classes

- **Circle**: Basic circle element with position and collision detection.
- **Ghost (extends Circle)**: Ghost character with specific color and movement behavior.
- **PacMan (extends Circle)**: Player-controlled character with unique movement and drawing logic.
- **Food (extends Circle)**: Food items for Pac-Man to collect for points.
- **AliveFood (extends Food)**: Food items with dynamic movement.
- **ZigZagAliveFood (extends AliveFood)**: Food items with zigzag movement upon collision with walls.
- **ZigZagRandomSizeAliveFood (extends ZigZagAliveFood)**: Food items with random size changes over time.
- **Game**: Manages the game loop, user input, and initializes the current game level.
- **Level**: Represents a game level with specific challenges.
- **Levels**: Manages the progression of game levels.

## Gameplay Controls

- Use the mouse to control Pac-Man's movement.
- Press the "Escape" key to pause the game.
- Press "1" to resume the game or "2" to quit.

## Game Development Notes

- Implemented using HTML5 canvas and JavaScript.
- Each level introduces new challenges and features.
- Sound effects are used for various game events.

## License

This Pac-Man game is provided under the MIT License. Feel free to explore, modify, and distribute the game as needed.
