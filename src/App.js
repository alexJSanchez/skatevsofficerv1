import React, { useEffect, useState } from 'react';
import './App.css';
import { drawHuman, drawZombies, drawExit, drawPit } from './drawCharecters.js';

function App() {

  const [gridSize, setGridSize] = useState(20);
  const [human, setHuman] = useState([{ x: 10, y: 10 }]);
  const [zombies, setZombies] = useState(Array(3).fill().map(() => randomGridPosition([])));
  const [exit, setExit] = useState(Array(1).fill().map(() => randomGridPosition([])));
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
    const head = { x: human[0].x + dx, y: human[0].y + dy };
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      return;
    }

    for (let sandPit of sandPits) {
      if (head.x === sandPit.x && head.y === sandPit.y) {
        return;
      }
    }

    setHuman([head]);
    moveZombies();
    checkCollisions(head);
  }

  function moveZombies() {
    setZombies(prevZombies => {
      const occupiedPositions = new Set();
      const updatedZombies = [];

      prevZombies.forEach(zombie => {
        let newZombie = { ...zombie };
        const dx = human[0].x - zombie.x;
        const dy = human[0].y - zombie.y;

        // Move the zombie towards the human
        if (dx !== 0) {
          newZombie.x += Math.sign(dx);
        }
        if (dy !== 0) {
          newZombie.y += Math.sign(dy);
        }

        // Check if the zombie hits a sand pit
        const sandPitCollision = sandPits.some(sandPit => newZombie.x === sandPit.x && newZombie.y === sandPit.y);
        if (sandPitCollision) {
          return; // Skip adding this zombie to the updated list
        }

        // Check for collisions with other zombies
        if (!occupiedPositions.has(`${newZombie.x}-${newZombie.y}`)) {
          occupiedPositions.add(`${newZombie.x}-${newZombie.y}`);
          updatedZombies.push(newZombie);
        } else {
          updatedZombies.push(zombie); // Keep the zombie in its current position if new position is occupied
        }
      });

      return updatedZombies;
    });
  }



  function checkCollisions(humanHead) {
    for (let exitPos of exit) {
      if (humanHead.x === exitPos.x && humanHead.y === exitPos.y) {
        startGame(false);
        alert('You escaped! Congratulations!');
        return;
      }
    }
    // Check if human hits zombies
    zombies.forEach((zombiePos, index) => {
      if (humanHead.x === zombiePos.x && humanHead.y === zombiePos.y) {
        alert("Zombie has eaten your brain");
      }
    });
    zombies.forEach((zombiePos, index) => {
      if (humanHead.x === zombiePos.x && humanHead.y === zombiePos.y) {
        alert("Zombie has eaten your brain");
        // You can add logic here to reset the game or handle the collision
      }
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
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, human]);
  useEffect(() => {
    if (gameStarted) {
      const newZombies = Array(3).fill().map(() => randomGridPosition([]));
      const newExit = Array(1).fill().map(() => randomGridPosition([...newZombies]));
      const newSandPits = Array(10).fill().map(() => randomGridPosition([...newZombies, ...newExit]));
      setZombies(newZombies);
      setExit(newExit);
      setSandPits(newSandPits);
    }
  }, [gameStarted]);

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
                    {drawZombies(zombies)}
                    {drawExit(exit)}
                    {drawPit(sandPits)}
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
