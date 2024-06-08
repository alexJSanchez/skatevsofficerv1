import React, { useEffect, useState } from 'react';
import './App.css';
import { drawHuman, drawZombies, drawExit, drawPit } from './drawCharecters.js';

function App() {
  const [gridSize, setGridSize] = useState(20);
  const [human, setHuman] = useState([{ x: 10, y: 10 }]);
  const [zombies, setZombies] = useState([]);
  const [exit, setExit] = useState([]);
  const [sandPits, setSandPits] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  function startGame(condition) {
    setGameStarted(condition);
    setGameScore(0);
    setHuman([{ x: 10, y: 10 }]);
    const newZombies = Array(3).fill().map(() => randomGridPosition([]));
    const newExit = Array(1).fill().map(() => randomGridPosition([]));
    const newSandPits = Array(10).fill().map(() => randomGridPosition([...newZombies, ...newExit]));
    setZombies(newZombies);
    setExit(newExit);
    setSandPits(newSandPits);
  }
  function randomGridPosition(existingPositions) {
    let position;
    do {
      position = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (existingPositions.some(pos => pos.x === position.x && pos.y === position.y) || (position.x === 10 && position.y === 10));
    return position;
  }
  function moveHuman(dx, dy) {
    setHuman(prevHuman => {
      const newX = prevHuman.x + dx;
      const newY = prevHuman.y + dy;

      if (newX >= 1 && newX <= gridSize && newY >= 1 && newY <= gridSize) {
        return { x: newX, y: newY };
      }

      return prevHuman;
    });
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (!gameStarted && event.key === ' ') {
        startGame(true);
      } else if (gameStarted) {
        switch (event.key) {
          case 'w': moveHuman(0, -1); break;
          case 'e': moveHuman(1, -1); break;
          case 'd': moveHuman(1, 0); break;
          case 'c': moveHuman(1, 1); break;
          case 'x': moveHuman(0, 1); break;
          case 'z': moveHuman(-1, 1); break;
          case 'a': moveHuman(-1, 0); break;
          case 'q': moveHuman(-1, -1); break;
          default: break;
        }
      }
    } window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, human]);

  return (
    <div className="App">
      <div>
        <div className="scores">
          <h1 id="score">{gameScore}</h1>
          <h1 id="highScore">0</h1>
        </div>
        <div className="game-border-1">
          <div className="game-border-2">
            <div className="game-border-3">
              <div id="game-board">
                {gameStarted ?
                  <>
                    {drawHuman(human)}
                  </> :
                  <div>
                    <h1 id="instruction-text">Skater Vs Zombies Press Space Bar</h1>
                    <img id="logo" src="HULKGREY.png" alt="snake-logo" />
                    <div id="gameInstructions">
                      <p>These are the instructions to the game</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
