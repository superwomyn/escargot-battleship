import { Board, Ship, Position, ComputerMoveResult } from '../types';
import { checkForHit, checkForSunk } from './gameLogic';

interface TargetCell extends Position {
  direction?: 'up' | 'down' | 'left' | 'right';
}

// Store computer's state for target tracking
let lastHit: Position | null = null;
let hitsInProgress: Position[] = [];
let targetDirection: 'up' | 'down' | 'left' | 'right' | null = null;
let potentialTargets: Position[] = [];

// Reset computer AI state
export const resetComputerAI = (): void => {
  lastHit = null;
  hitsInProgress = [];
  targetDirection = null;
  potentialTargets = [];
};

// Get adjacent cells to target
const getAdjacentCells = (row: number, col: number, board: Board): TargetCell[] => {
  const adjacentCells: TargetCell[] = [
    { row: row - 1, col, direction: 'up' },    // up
    { row: row + 1, col, direction: 'down' },  // down
    { row, col: col - 1, direction: 'left' },  // left
    { row, col: col + 1, direction: 'right' }, // right
  ];
  
  // Filter out invalid cells or already targeted cells
  return adjacentCells.filter(cell => {
    return (
      cell.row >= 0 && 
      cell.row < 10 && 
      cell.col >= 0 && 
      cell.col < 10 &&
      board[cell.row][cell.col] !== 'hit' && 
      board[cell.row][cell.col] !== 'miss' &&
      board[cell.row][cell.col] !== 'sunk'
    );
  });
};

// Get the next cells to target in the current direction
const getNextCellInDirection = (
  row: number, 
  col: number, 
  direction: 'up' | 'down' | 'left' | 'right', 
  board: Board
): Position | null => {
  let nextRow = row;
  let nextCol = col;
  
  switch (direction) {
    case 'up':
      nextRow--;
      break;
    case 'down':
      nextRow++;
      break;
    case 'left':
      nextCol--;
      break;
    case 'right':
      nextCol++;
      break;
  }
  
  // Check if the next cell is valid
  if (
    nextRow >= 0 && 
    nextRow < 10 && 
    nextCol >= 0 && 
    nextCol < 10 &&
    board[nextRow][nextCol] !== 'hit' && 
    board[nextRow][nextCol] !== 'miss' &&
    board[nextRow][nextCol] !== 'sunk'
  ) {
    return { row: nextRow, col: nextCol };
  }
  
  return null;
};

// Get opposite direction
const getOppositeDirection = (direction: 'up' | 'down' | 'left' | 'right'): 'up' | 'down' | 'left' | 'right' => {
  switch (direction) {
    case 'up': return 'down';
    case 'down': return 'up';
    case 'left': return 'right';
    case 'right': return 'left';
  }
};

// Computer makes a move
export const computerMove = (playerBoard: Board, playerShips: Ship[]): ComputerMoveResult => {
  let targetRow: number, targetCol: number;
  
  // Check if we're in hunt mode (random shots) or target mode (targeted shots)
  if (hitsInProgress.length === 0) {
    // Hunt mode - choose a random unattacked cell
    const unattackedCells: Position[] = [];
    
    // Consider a checkerboard pattern for efficiency
    const useCheckerboard = Math.random() < 0.7; // 70% chance to use checkerboard
    
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (
          playerBoard[row][col] !== 'hit' && 
          playerBoard[row][col] !== 'miss' &&
          playerBoard[row][col] !== 'sunk'
        ) {
          // For checkerboard pattern, only consider cells where row+col is even
          if (!useCheckerboard || (row + col) % 2 === 0) {
            unattackedCells.push({ row, col });
          }
        }
      }
    }
    
    // If no cells match our pattern or checkerboard is depleted, use any unattacked cell
    if (unattackedCells.length === 0) {
      for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
          if (
            playerBoard[row][col] !== 'hit' && 
            playerBoard[row][col] !== 'miss' &&
            playerBoard[row][col] !== 'sunk'
          ) {
            unattackedCells.push({ row, col });
          }
        }
      }
    }
    
    if (unattackedCells.length === 0) {
      console.error('No unattacked cells available!');
      return { hit: false, board: playerBoard };
    }
    
    // Choose a random unattacked cell
    const randomIndex = Math.floor(Math.random() * unattackedCells.length);
    targetRow = unattackedCells[randomIndex].row;
    targetCol = unattackedCells[randomIndex].col;
  } else {
    // Target mode - we have hits and are looking for more
    
    // If we have potential targets, use those first
    if (potentialTargets.length > 0) {
      const target = potentialTargets.shift()!;
      targetRow = target.row;
      targetCol = target.col;
    }
    // If we have a direction, continue in that direction
    else if (targetDirection && lastHit) {
      const nextCell = getNextCellInDirection(
        lastHit.row, 
        lastHit.col, 
        targetDirection, 
        playerBoard
      );
      
      if (nextCell) {
        targetRow = nextCell.row;
        targetCol = nextCell.col;
      } else {
        // If we can't continue in current direction, try the opposite direction
        const oppositeDirection = getOppositeDirection(targetDirection);
        const firstHit = hitsInProgress[0];
        
        const oppositeCell = getNextCellInDirection(
          firstHit.row, 
          firstHit.col, 
          oppositeDirection, 
          playerBoard
        );
        
        if (oppositeCell) {
          targetRow = oppositeCell.row;
          targetCol = oppositeCell.col;
          targetDirection = oppositeDirection;
        } else {
          // If we can't go in either direction, switch back to hunt mode
          hitsInProgress = [];
          targetDirection = null;
          return computerMove(playerBoard, playerShips);
        }
      }
    }
    // Otherwise check adjacent cells to our last hit
    else if (lastHit) {
      const adjacentCells = getAdjacentCells(lastHit.row, lastHit.col, playerBoard);
      
      if (adjacentCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * adjacentCells.length);
        const target = adjacentCells[randomIndex];
        
        targetRow = target.row;
        targetCol = target.col;
        
        // Remember the direction for future reference
        targetDirection = target.direction || null;
      } else {
        // If no adjacent cells are available, switch back to hunt mode
        hitsInProgress = [];
        targetDirection = null;
        lastHit = null;
        return computerMove(playerBoard, playerShips);
      }
    } else {
      // Should never happen, but just in case
      hitsInProgress = [];
      targetDirection = null;
      return computerMove(playerBoard, playerShips);
    }
  }
  
  // Perform the attack
  const result = checkForHit(playerBoard, targetRow, targetCol);
  
  if (result.hit) {
    lastHit = { row: targetRow, col: targetCol };
    hitsInProgress.push(lastHit);
    
    // Check if a ship was sunk
    const sunkResult = checkForSunk(result.board, playerShips, targetRow, targetCol);
    
    if (sunkResult.sunk) {
      // Reset targeting since we sunk the ship
      hitsInProgress = [];
      lastHit = null;
      targetDirection = null;
      potentialTargets = [];
      
      return {
        hit: true,
        sunk: true,
        shipId: sunkResult.shipId,
        shipName: sunkResult.shipName,
        board: sunkResult.board
      };
    } else {
      // If we have more than one hit and no direction yet, establish direction
      if (hitsInProgress.length > 1 && !targetDirection) {
        const firstHit = hitsInProgress[0];
        const lastHitPos = hitsInProgress[hitsInProgress.length - 1];
        
        if (firstHit.row === lastHitPos.row) {
          targetDirection = firstHit.col < lastHitPos.col ? 'right' : 'left';
        } else {
          targetDirection = firstHit.row < lastHitPos.row ? 'down' : 'up';
        }
        
        // Add the next cell in line to potential targets
        const nextCell = getNextCellInDirection(
          lastHitPos.row, 
          lastHitPos.col, 
          targetDirection, 
          result.board
        );
        
        if (nextCell) {
          potentialTargets.push(nextCell);
        }
        
        // Also try the opposite direction
        const oppositeDirection = getOppositeDirection(targetDirection);
        const oppositeCell = getNextCellInDirection(
          firstHit.row, 
          firstHit.col, 
          oppositeDirection, 
          result.board
        );
        
        if (oppositeCell) {
          potentialTargets.push(oppositeCell);
        }
      }
    }
    
    return { hit: true, sunk: false, board: result.board };
  } else {
    // If we miss and have a direction, keep the direction but update last hit
    if (targetDirection && hitsInProgress.length > 0) {
      // If we miss while going in a direction, try the opposite direction
      const oppositeDirection = getOppositeDirection(targetDirection);
      const firstHit = hitsInProgress[0];
      
      const oppositeCell = getNextCellInDirection(
        firstHit.row, 
        firstHit.col, 
        oppositeDirection, 
        result.board
      );
      
      if (oppositeCell) {
        potentialTargets = [oppositeCell];
        targetDirection = oppositeDirection;
      }
    }
    
    return { hit: false, board: result.board };
  }
};