import { Board, Ship, Orientation, Position, PlacementResult, AttackResult } from '../types';

// Initialize a new game with empty board and ships
export const initializeGame = (): { board: Board, ships: Ship[] } => {
  // Create empty 10x10 board
  const board: Board = Array(10).fill(null).map(() => Array(10).fill('empty'));
  
  // Define ships with their properties
  const ships: Ship[] = [
    { id: 'carrier', name: 'Carrier', size: 5, placed: false, positions: [], sunk: false },
    { id: 'battleship', name: 'Battleship', size: 4, placed: false, positions: [], sunk: false },
    { id: 'cruiser', name: 'Cruiser', size: 3, placed: false, positions: [], sunk: false },
    { id: 'submarine', name: 'Submarine', size: 3, placed: false, positions: [], sunk: false },
    { id: 'destroyer', name: 'Destroyer', size: 2, placed: false, positions: [], sunk: false },
  ];
  
  return { board, ships };
};

// Check if a ship can be placed at the specified position
export const canPlaceShip = (board: Board, row: number, col: number, size: number, orientation: Orientation): boolean => {
  // Check if the ship would extend beyond the board
  if (orientation === 'horizontal' && col + size > 10) {
    return false;
  }
  if (orientation === 'vertical' && row + size > 10) {
    return false;
  }
  
  // Check if the ship would overlap with another ship
  for (let i = 0; i < size; i++) {
    const checkRow = orientation === 'horizontal' ? row : row + i;
    const checkCol = orientation === 'horizontal' ? col + i : col;
    
    if (board[checkRow][checkCol] !== 'empty') {
      return false;
    }
    
    // Check adjacent cells (ships cannot touch)
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const adjacentRow = checkRow + dr;
        const adjacentCol = checkCol + dc;
        
        // Skip out of bounds and the cell itself
        if (
          adjacentRow < 0 || 
          adjacentRow >= 10 || 
          adjacentCol < 0 || 
          adjacentCol >= 10 ||
          (adjacentRow === checkRow && adjacentCol === checkCol)
        ) {
          continue;
        }
        
        // If adjacent cell has a ship, placement is invalid
        if (board[adjacentRow][adjacentCol] !== 'empty') {
          return false;
        }
      }
    }
  }
  
  return true;
};

// Place a ship on the board
export const placeShip = (board: Board, ship: Ship, row: number, col: number, orientation: Orientation): PlacementResult => {
  // Check if placement is valid
  if (!canPlaceShip(board, row, col, ship.size, orientation)) {
    return { success: false, board };
  }
  
  // Create a copy of the board
  const newBoard: Board = board.map(row => [...row]);
  const positions: Position[] = [];
  
  // Place the ship
  for (let i = 0; i < ship.size; i++) {
    const shipRow = orientation === 'horizontal' ? row : row + i;
    const shipCol = orientation === 'horizontal' ? col + i : col;
    
    newBoard[shipRow][shipCol] = 'ship';
    positions.push({ row: shipRow, col: shipCol });
  }
  
  return { success: true, board: newBoard, positions };
};

// Randomly place a ship on the board
export const placeShipRandomly = (board: Board, ship: Ship): PlacementResult => {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    const row = Math.floor(Math.random() * 10);
    const col = Math.floor(Math.random() * 10);
    const orientation: Orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    
    const result = placeShip(board, ship, row, col, orientation);
    
    if (result.success) {
      return result;
    }
    
    attempts++;
  }
  
  console.error(`Failed to place ship ${ship.name} after ${maxAttempts} attempts`);
  return { success: false, board };
};

// Check if an attack hits a ship
export const checkForHit = (board: Board, row: number, col: number): AttackResult => {
  // Cannot attack the same location twice
  if (board[row][col] === 'hit' || board[row][col] === 'miss' || board[row][col] === 'sunk') {
    return { hit: false, alreadyHit: true, board };
  }
  
  // Create a copy of the board
  const newBoard: Board = board.map(row => [...row]);
  
  // Check if there is a ship at the target location
  const hit = board[row][col] === 'ship';
  
  // Update the board
  newBoard[row][col] = hit ? 'hit' : 'miss';
  
  return { hit, alreadyHit: false, board: newBoard };
};

// Check if a ship has been sunk
export const checkForSunk = (board: Board, ships: Ship[], row: number, col: number): AttackResult & { board: Board } => {
  // Find which ship was hit
  let hitShip: Ship | null = null;
  let allPositionsHit = false;
  
  for (const ship of ships) {
    if (ship.positions.some(pos => pos.row === row && pos.col === col)) {
      hitShip = ship;
      
      // Check if all positions of this ship are hit
      allPositionsHit = ship.positions.every(pos => 
        board[pos.row][pos.col] === 'hit' || board[pos.row][pos.col] === 'sunk'
      );
      
      break;
    }
  }
  
  if (hitShip && allPositionsHit) {
    // Update the board to mark the ship as sunk
    const newBoard: Board = board.map(row => [...row]);
    
    hitShip.positions.forEach(pos => {
      newBoard[pos.row][pos.col] = 'sunk';
    });
    
    return {
      hit: true,
      sunk: true,
      shipId: hitShip.id,
      shipName: hitShip.name,
      board: newBoard
    };
  }
  
  return { hit: true, sunk: false, board };
};

// Check if all ships have been sunk (win condition)
export const checkForWin = (ships: Ship[]): boolean => {
  return ships.every(ship => ship.sunk);
};