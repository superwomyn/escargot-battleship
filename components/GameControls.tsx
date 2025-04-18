'use client';

import React from 'react';
import Ship from './Ship';
import { GamePhase, Ship as ShipType, Orientation } from '../types';

interface GameControlsProps {
  gamePhase: GamePhase;
  ships: ShipType[];
  selectedShip: ShipType | null;
  orientation: Orientation;
  onShipSelect: (shipId: string) => void;
  onOrientationToggle: () => void;
  onStartNewGame: () => void;
  onRandomPlacement: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gamePhase,
  ships,
  selectedShip,
  orientation,
  onShipSelect,
  onOrientationToggle,
  onStartNewGame,
  onRandomPlacement
}) => {
  const renderSetupControls = () => {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Place Your Ships</h3>
        <div className="flex flex-wrap justify-center mb-4">
          {ships.map((ship) => (
            <Ship
              key={ship.id}
              ship={ship}
              isSelected={selectedShip && selectedShip.id === ship.id}
              onClick={onShipSelect}
            />
          ))}
        </div>
        
        <div className="flex space-x-4 mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onOrientationToggle}
            disabled={!selectedShip}
          >
            Orientation: {orientation}
          </button>
          
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded mb-2"
            onClick={onRandomPlacement}
          >
            Place Ships Randomly
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mt-2">
          <p>1. Select a ship from above</p>
          <p>2. Choose horizontal or vertical orientation</p>
          <p>3. Click on your board to place the ship</p>
          <p>- Or use the random placement button to place all ships automatically</p>
        </div>
      </div>
    );
  };
  
  const renderPlayingControls = () => {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Ships Status</h3>
        <div className="flex flex-wrap justify-center mb-4">
          {ships.map((ship) => (
            <Ship
              key={ship.id}
              ship={ship}
              isSelected={false}
              onClick={() => {}}
            />
          ))}
        </div>
        
        <div className="text-sm text-gray-600 mt-2">
          <p>Click on the computer's board to attack!</p>
        </div>
      </div>
    );
  };
  
  const renderGameOverControls = () => {
    return (
      <div className="flex flex-col items-center">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mt-4"
          onClick={onStartNewGame}
        >
          Start New Game
        </button>
      </div>
    );
  };
  
  return (
    <div className="mt-8 w-full max-w-2xl">
      {gamePhase === 'setup' && renderSetupControls()}
      {gamePhase === 'playing' && renderPlayingControls()}
      {gamePhase === 'gameover' && renderGameOverControls()}
      
      {gamePhase !== 'setup' && gamePhase !== 'gameover' && (
        <div className="mt-4 text-center">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={onStartNewGame}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default GameControls;