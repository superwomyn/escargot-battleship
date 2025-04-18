# Battleship Game

A React and Next.js implementation of the classic Battleship game.

## Features

- Classic 10x10 Battleship gameplay
- Ship placement (manual or random)
- Turn-based gameplay against a computer opponent
- Smart computer AI that hunts for ships once it gets a hit
- Responsive design that works on mobile and desktop

## Game Rules

1. **Ship Placement**:
   * Players place a fleet of 5 ships of varying lengths (Carrier – 5, Battleship – 4, Cruiser – 3, Submarine – 3, Destroyer – 2) on their grid.
   * Ships can be placed horizontally or vertically but not diagonally.
   * Ships cannot overlap or extend beyond the grid.

2. **Taking Turns**:
   * Players take turns attacking grid coordinates.
   * The game responds with "hit" if the coordinate hits a ship, or "miss" if it does not.
   * If all cells of a ship are hit, that ship is considered sunk.

3. **Winning the Game**:
   * The first player to sink all of the opponent's ships wins.

## Setup and Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/battleship-game.git
cd battleship-game
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Open the game in your browser**

Open [http://localhost:3000](http://localhost:3000) in your browser to play the game.

## Technologies Used

- React 18
- Next.js 14
- Tailwind CSS for styling

## Project Structure

```
battleship/
├── app/
│   ├── page.js         # Main game page
│   ├── layout.js       # Layout wrapper
│   └── globals.css     # Global styles
├── components/
│   ├── Board.jsx       # Game board component
│   ├── Cell.jsx        # Individual cell component
│   ├── Ship.jsx        # Ship component for placement
│   ├── GameControls.jsx # Controls for game flow
│   └── GameStatus.jsx  # Display game status and messages
├── lib/
│   ├── gameLogic.js    # Game rules and logic
│   └── computerAI.js   # Computer opponent logic
└── public/
    └── assets/         # Images and sounds
```

## Future Enhancements

- Add sound effects for hits, misses, and sunk ships
- Implement multiplayer functionality
- Add difficulty levels for the AI
- Add animations for hits and misses
- Save game state to localStorage

## License

This project is licensed under the MIT License - see the LICENSE file for details.
