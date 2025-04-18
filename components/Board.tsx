'use client';

import React from 'react';
import Cell from './Cell';
import { Board as BoardType, Ship, GamePhase } from '../types';

interface BoardProps {
  board: BoardType;
  type: 'player' | 'computer';
  onCellClick: (row: number, col: number) => void;
  ships: Ship[];
  gamePhase: GamePhase;
  showShips: boolean;
}

const Board: React.FC<BoardProps> = ({
  board,
  type,
  onCellClick,
  ships,
  gamePhase,
  showShips
}) => {
  if (!board) return null;
  
  // Create column labels (A-J)
  const columnLabels = Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i));
  
  // Create row labels (1-10)
  const rowLabels = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  
  return (
    <div className="relative">
      <div className="board-labels">
        {columnLabels.map((label) => (
          <span key={`col-${label}`} className="board-label">{label}</span>
        ))}
      </div>
      
      <div className="board-labels-side">
        {rowLabels.map((label) => (
          <span key={`row-${label}`} className="board-label">{label}</span>
        ))}
      </div>
      
      <div className="game-board">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            // Determine if this cell has a ship and if we should show it
            let hasShip = false;
            let isHit = cell === 'hit' || cell === 'sunk';
            let isMiss = cell === 'miss';
            let shipId: string | null = null;
            
            if (showShips) {
              ships.forEach(ship => {
                if (ship.positions && ship.positions.some(pos => pos.row === rowIndex && pos.col === colIndex)) {
                  hasShip = true;
                  shipId = ship.id;
                }
              });
            } else if (type === 'player') {
              // Always show ships on player's board
              ships.forEach(ship => {
                if (ship.positions && ship.positions.some(pos => pos.row === rowIndex && pos.col === colIndex)) {
                  hasShip = true;
                  shipId = ship.id;
                }
              });
            }
            
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                row={rowIndex}
                col={colIndex}
                status={cell}
                hasShip={hasShip}
                shipId={shipId}
                onClick={() => {
                  // Only allow clicking on computer's board during play phase
                  // or on player's board during setup
                  if (
                    (gamePhase === 'playing' && type === 'computer') ||
                    (gamePhase === 'setup' && type === 'player')
                  ) {
                    onCellClick(rowIndex, colIndex);
                  }
                }}
                isAttackable={gamePhase === 'playing' && type === 'computer' && cell !== 'hit' && cell !== 'miss' && cell !== 'sunk'}
                isPlaceable={gamePhase === 'setup' && type === 'player' && cell === 'empty'}
              />
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Board;