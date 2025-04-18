'use client';

import React from 'react';

interface ShipProps {
  ship: {
    id: string;
    name: string;
    size: number;
    placed: boolean;
    sunk: boolean;
  };
  isSelected: boolean;
  onClick: (id: string) => void;
}

const Ship: React.FC<ShipProps> = ({ ship, isSelected, onClick }) => {
  const getShipClass = (): string => {
    let classNames = 'ship-item';
    
    if (isSelected) {
      classNames += ' ship-selected';
    }
    
    if (ship.placed) {
      classNames += ' ship-placed';
    }
    
    if (ship.sunk) {
      classNames += ' ship-sunk';
    }
    
    return classNames;
  };
  
  return (
    <div 
      className={getShipClass()}
      onClick={() => onClick(ship.id)}
    >
      {ship.name} ({ship.size})
    </div>
  );
};

export default Ship;