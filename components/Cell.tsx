'use client';

import React from 'react';
import { CellStatus } from '../types';

interface CellProps {
  row: number;
  col: number;
  status: CellStatus;
  hasShip: boolean;
  shipId: string | null;
  onClick: () => void;
  isAttackable: boolean;
  isPlaceable: boolean;
}

const Cell: React.FC<CellProps> = ({
  row,
  col,
  status,
  hasShip,
  shipId,
  onClick,
  isAttackable,
  isPlaceable
}) => {
  const getCellClass = (): string => {
    let classNames = 'cell';
    
    if (status === 'hit' || status === 'sunk') {
      classNames += ' cell-hit';
    } else if (status === 'miss') {
      classNames += ' cell-miss';
    } else if (hasShip) {
      classNames += ' cell-ship';
    } else {
      classNames += ' cell-empty';
    }
    
    if (isAttackable) {
      classNames += ' cell-attackable';
    }
    
    if (isPlaceable) {
      classNames += ' cell-placeable';
    }
    
    return classNames;
  };
  
  return (
    <div
      className={getCellClass()}
      onClick={onClick}
      data-row={row}
      data-col={col}
      data-ship-id={shipId}
    />
  );
};

export default Cell;