// Cell status types
export type CellStatus = 'empty' | 'ship' | 'hit' | 'miss' | 'sunk';

// Game phase types
export type GamePhase = 'setup' | 'playing' | 'gameover';

// Board type (10x10 grid)
export type Board = CellStatus[][];

// Ship position type
export interface Position {
  row: number;
  col: number;
}

// Ship orientation type
export type Orientation = 'horizontal' | 'vertical';

// Ship type
export interface Ship {
  id: string;
  name: string;
  size: number;
  placed: boolean;
  positions: Position[];
  sunk: boolean;
}

// Game state interface
export interface GameState {
  playerBoard: Board;
  computerBoard: Board;
  playerShips: Ship[];
  computerShips: Ship[];
  gamePhase: GamePhase;
  playerTurn: boolean;
  message: string;
  winner: 'player' | 'computer' | null;
}

// Ship placement result
export interface PlacementResult {
  success: boolean;
  board: Board;
  positions?: Position[];
}

// Attack result
export interface AttackResult {
  hit: boolean;
  alreadyHit?: boolean;
  board: Board;
  sunk?: boolean;
  shipId?: string;
  shipName?: string;
}

// Computer move result
export interface ComputerMoveResult {
  hit: boolean;
  board: Board;
  sunk?: boolean;
  shipId?: string;
  shipName?: string;
}