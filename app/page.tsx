'use client';

import { useState, useEffect } from 'react';
import Board from '../components/Board';
import GameControls from '../components/GameControls';
import GameStatus from '../components/GameStatus';
import { initializeGame, placeShip, placeShipRandomly, checkForHit, checkForSunk, checkForWin } from '../lib/gameLogic';
import { computerMove, resetComputerAI } from '../lib/computerAI';
import { Board as BoardType, Ship, GamePhase, Orientation } from '../types';

export default function Home() {
  // Game states
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [playerBoard, setPlayerBoard] = useState<BoardType | null>(null);
  const [computerBoard, setComputerBoard] = useState<BoardType | null>(null);
  const [playerShips, setPlayerShips] = useState<Ship[]>([]);
  const [computerShips, setComputerShips] = useState<Ship[]>([]);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [shipOrientation, setShipOrientation] = useState<Orientation>('horizontal');
  const [playerTurn, setPlayerTurn] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('Place your ships on the board.');
  const [winner, setWinner] = useState<'player' | 'computer' | null>(null);
  
  // Initialize game boards
  useEffect(() => {
    const { board: playerInitialBoard, ships: playerInitialShips } = initializeGame();
    const { board: computerInitialBoard, ships: computerInitialShips } = initializeGame();
    
    setPlayerBoard(playerInitialBoard);
    setComputerBoard(computerInitialBoard);
    setPlayerShips(playerInitialShips);
    setComputerShips(computerInitialShips);
    
    // Randomly place computer ships
    let updatedComputerBoard = [...computerInitialBoard];
    const updatedComputerShips = [...computerInitialShips];
    
    for (const ship of computerInitialShips) {
      const result = placeShipRandomly(updatedComputerBoard, ship);
      if (result.success) {
        updatedComputerBoard = result.board;
        const shipIndex = updatedComputerShips.findIndex(s => s.id === ship.id);
        updatedComputerShips[shipIndex] = { 
          ...ship, 
          placed: true, 
          positions: result.positions || [] 
        };
      }
    }
    
    setComputerBoard(updatedComputerBoard);
    setComputerShips(updatedComputerShips);
  }, []);
  
  // Handle ship placement
  const handleShipSelect = (shipId: string) => {
    const ship = playerShips.find(ship => ship.id === shipId);
    if (!ship || ship.placed) {
      return; // Can't select already placed ships
    }
    setSelectedShip(ship);
  };
  
  const toggleOrientation = () => {
    setShipOrientation(shipOrientation === 'horizontal' ? 'vertical' : 'horizontal');
  };
  
  const handleCellClick = (board: 'player' | 'computer', row: number, col: number) => {
    if (gamePhase === 'setup' && board === 'player' && selectedShip && playerBoard) {
      // Place ship on player's board
      const result = placeShip(playerBoard, selectedShip, row, col, shipOrientation);
      
      if (result.success) {
        // Update the board
        setPlayerBoard(result.board);
        
        // Update the ship status
        const updatedShips = [...playerShips];
        const shipIndex = updatedShips.findIndex(ship => ship.id === selectedShip.id);
        updatedShips[shipIndex] = { 
          ...selectedShip, 
          placed: true, 
          positions: result.positions || [] 
        };
        
        setPlayerShips(updatedShips);
        setSelectedShip(null);
        
        // Check if all ships are placed to move to playing phase
        if (updatedShips.every(ship => ship.placed)) {
          setGamePhase('playing');
          setMessage('Game started! Choose a cell on the enemy board to attack.');
        } else {
          setMessage('Ship placed! Select another ship to place.');
        }
      } else {
        setMessage('Cannot place ship here. Try another position.');
      }
    } else if (gamePhase === 'playing' && playerTurn && board === 'computer' && computerBoard) {
      // Player attacks computer
      const result = checkForHit(computerBoard, row, col);
      if (result.alreadyHit) {
        setMessage('You already fired at this location. Try again.');
        return;
      }
      
      const updatedComputerBoard = result.board;
      setComputerBoard(updatedComputerBoard);
      
      if (result.hit) {
        setMessage('Hit!');
        const sunkResult = checkForSunk(updatedComputerBoard, computerShips, row, col);
        if (sunkResult.sunk) {
          setMessage(`You sunk the enemy's ${sunkResult.shipName}!`);
          const updatedShips = [...computerShips];
          const shipIndex = updatedShips.findIndex(ship => ship.id === sunkResult.shipId);
          if (shipIndex !== -1) {
            updatedShips[shipIndex] = { ...updatedShips[shipIndex], sunk: true };
            setComputerShips(updatedShips);
            
            if (checkForWin(updatedShips)) {
              setGamePhase('gameover');
              setWinner('player');
              setMessage('Congratulations! You won!');
              return;
            }
          }
        }
      } else {
        setMessage('Miss!');
      }
      
      setPlayerTurn(false);
      
      // Computer's turn after a delay
      setTimeout(() => {
        if (gamePhase === 'playing' && playerBoard) {
          const computerMoveResult = computerMove(playerBoard, playerShips);
          setPlayerBoard(computerMoveResult.board);
          
          if (computerMoveResult.hit) {
            setMessage('Your ship was hit!');
            
            if (computerMoveResult.sunk) {
              setMessage(`Your ${computerMoveResult.shipName} was sunk!`);
              const updatedPlayerShips = [...playerShips];
              const shipIndex = updatedPlayerShips.findIndex(ship => ship.id === computerMoveResult.shipId);
              if (shipIndex !== -1) {
                updatedPlayerShips[shipIndex] = { ...updatedPlayerShips[shipIndex], sunk: true };
                setPlayerShips(updatedPlayerShips);
                
                if (checkForWin(updatedPlayerShips)) {
                  setGamePhase('gameover');
                  setWinner('computer');
                  setMessage('Game over! The computer sank all your ships!');
                  return;
                }
              }
            }
          } else {
            setMessage('The computer missed. Your turn!');
          }
          
          setPlayerTurn(true);
        }
      }, 1000);
    }
  };
  
  const startNewGame = () => {
    // Reset all game state
    const { board: playerInitialBoard, ships: playerInitialShips } = initializeGame();
    const { board: computerInitialBoard, ships: computerInitialShips } = initializeGame();
    
    setPlayerBoard(playerInitialBoard);
    setComputerBoard(computerInitialBoard);
    setPlayerShips(playerInitialShips);
    setComputerShips(computerInitialShips);
    setSelectedShip(null);
    setShipOrientation('horizontal');
    setGamePhase('setup');
    setPlayerTurn(true);
    setMessage('Place your ships on the board.');
    setWinner(null);
    
    // Reset computer AI
    resetComputerAI();
    
    // Place computer ships randomly
    let updatedComputerBoard = [...computerInitialBoard];
    const updatedComputerShips = [...computerInitialShips];
    
    for (const ship of computerInitialShips) {
      const result = placeShipRandomly(updatedComputerBoard, ship);
      if (result.success) {
        updatedComputerBoard = result.board;
        const shipIndex = updatedComputerShips.findIndex(s => s.id === ship.id);
        updatedComputerShips[shipIndex] = { 
          ...ship, 
          placed: true, 
          positions: result.positions || [] 
        };
      }
    }
    
    setComputerBoard(updatedComputerBoard);
    setComputerShips(updatedComputerShips);
  };
  
  // Function to place all ships randomly for player (quick start)
  const placeShipsRandomly = () => {
    if (gamePhase !== 'setup' || !playerBoard) return;
    
    let updatedPlayerBoard = [...playerBoard];
    const updatedPlayerShips = [...playerShips];
    
    for (const ship of playerShips) {
      if (!ship.placed) {
        const result = placeShipRandomly(updatedPlayerBoard, ship);
        if (result.success) {
          updatedPlayerBoard = result.board;
          const shipIndex = updatedPlayerShips.findIndex(s => s.id === ship.id);
          updatedPlayerShips[shipIndex] = { 
            ...ship, 
            placed: true, 
            positions: result.positions || [] 
          };
        }
      }
    }
    
    setPlayerBoard(updatedPlayerBoard);
    setPlayerShips(updatedPlayerShips);
    
    // Move to playing phase
    setGamePhase('playing');
    setMessage('Ships placed randomly! Game started. Choose a cell on the enemy board to attack.');
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <h1 className="text-4xl font-bold mb-8">Battleship Game</h1>
      
      <GameStatus 
        message={message} 
        gamePhase={gamePhase} 
        playerTurn={playerTurn}
        winner={winner}
      />
      
      <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
        <div className="flex flex-col items-center mr-8">
          <h2 className="text-xl font-semibold mb-8">Your Board</h2>
          {playerBoard && (
            <Board 
              board={playerBoard} 
              type="player"
              onCellClick={(row, col) => handleCellClick('player', row, col)}
              ships={playerShips}
              gamePhase={gamePhase}
              showShips={true}
            />
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-8">Computer&apos;s Board</h2>
          {computerBoard && (
            <Board 
              board={computerBoard} 
              type="computer"
              onCellClick={(row, col) => handleCellClick('computer', row, col)}
              ships={computerShips}
              gamePhase={gamePhase}
              showShips={gamePhase === 'gameover'}
            />
          )}
        </div>
      </div>
      
      <GameControls 
        gamePhase={gamePhase}
        ships={playerShips}
        selectedShip={selectedShip}
        orientation={shipOrientation}
        onShipSelect={handleShipSelect}
        onOrientationToggle={toggleOrientation}
        onStartNewGame={startNewGame}
        onRandomPlacement={placeShipsRandomly}
      />
    </main>
  );
}