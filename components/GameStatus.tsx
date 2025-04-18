'use client';

import React from 'react';
import { GamePhase } from '../types';

interface GameStatusProps {
  message: string;
  gamePhase: GamePhase;
  playerTurn: boolean;
  winner: 'player' | 'computer' | null;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  message, 
  gamePhase, 
  playerTurn, 
  winner 
}) => {
  const getStatusClass = (): string => {
    let classNames = 'p-4 rounded-lg mb-6 text-center';
    
    if (gamePhase === 'setup') {
      classNames += ' bg-blue-100 text-blue-800';
    } else if (gamePhase === 'playing') {
      if (playerTurn) {
        classNames += ' bg-green-100 text-green-800';
      } else {
        classNames += ' bg-yellow-100 text-yellow-800';
      }
    } else if (gamePhase === 'gameover') {
      if (winner === 'player') {
        classNames += ' bg-green-100 text-green-800';
      } else {
        classNames += ' bg-red-100 text-red-800';
      }
    }
    
    return classNames;
  };
  
  const getStatusPrefix = (): string => {
    if (gamePhase === 'playing') {
      return playerTurn ? 'Your turn: ' : 'Computer\'s turn: ';
    }
    return '';
  };
  
  return (
    <div className={getStatusClass()}>
      <p className="font-semibold text-lg">{getStatusPrefix()}{message}</p>
      
      {gamePhase === 'playing' && (
        <div className="mt-2 text-sm">
          {playerTurn ? 
            'Click on the computer\'s board to attack!' : 
            'Computer is thinking...'
          }
        </div>
      )}
    </div>
  );
};

export default GameStatus;