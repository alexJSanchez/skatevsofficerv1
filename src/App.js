import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // Define game variables using useState hook
  const [gridSize, setGridSize] = useState(20);
  const [human, setHuman] = useState([{ x: 10, y: 10 }]);
  const [zombies, setZombies] = useState(Array(3).fill().map(() => randomGridPosition()));
  const [exit, setExit] = useState(Array(1).fill().map(() => randomGridPosition()));
  const [sandPits, setSandPits] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Start game function
  function startGame(condition) {
    setGameStarted(condition);
    // Other game initialization logic
  }

  // Draw human
  function drawHuman() {
    return human.map((segment, index) => (
      <div key={index} className="human" style={{ gridColumnStart: segment.x, gridRowStart: segment.y }}>
        S
      </div>
    ));
  }

  // Draw zombies
  function drawZombies() {
    return zombies.map((zombiePos, index) => (
      <div key={index} className="zombie" style={{ gridColumnStart: zombiePos.x, gridRowStart: zombiePos.y }}>
        Z
      </div>
    ));
  }

  // Draw exit
  function drawExit() {
    return exit.map((exitPos, index) => (
      <div key={index} className="exit" style={{ gridColumnStart: exitPos.x, gridRowStart: exitPos.y }}>
        E
      </div>
    ));
  }

  // Draw sand
  function drawPit() {
    return sandPits.map((sandPos, index) => (
      <div key={index} className="sand" style={{ gridColumnStart: sandPos.x, gridRowStart: sandPos.y }}>
        P
      </div>
    ));
  }

  // Random grid position
  function randomGridPosition() {
    let position;
    do {
      position = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (position.x === 10 && position.y === 10); // Ensure position is not at initial human position
    return position;
  }

  // Move human
  function moveHuman(dx, dy) {
    const head = { x: human[0].x + dx, y: human[0].y + dy };
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
      return; // prevent moving out of bounds
    }

    // Check if the new position is a sandpit
    for (let sandPit of sandPits) {
      if (head.x === sandPit.x && head.y === sandPit.y) {
        return; // prevent moving into sandpit
      }
    }

    setHuman([head]);
    //  moveZombies();
    // checkCollisions();
    // draw();
  }

  // Key press handler
  useEffect(() => {
    function handleKeyDown(event) {
      switch (event.key) {
        case 'w':
          moveHuman(0, -1);
          break;
        case 'e':
          moveHuman(1, -1);
          break;
        case 'd':
          moveHuman(1, 0);
          break;
        case 'c':
          moveHuman(1, 1);
          break;
        case 'x':
          moveHuman(0, 1);
          break;
        case 'z':
          moveHuman(-1, 1);
          break;
        case 'a':
          moveHuman(-1, 0);
          break;
        case 'q':
          moveHuman(-1, -1);
          break;
        case ' ':
          if (!gameStarted) {
            startGame(true);
          }
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameStarted, human]);

  useEffect(() => {
    if (gameStarted) {
      // Initialize zombies and exit when the game starts
      setZombies(Array(3).fill().map(() => randomGridPosition()));
      setExit(Array(1).fill().map(() => randomGridPosition()));
      setSandPits(Array(10).fill().map(() => randomGridPosition()));
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
                    {drawHuman()}
                    {drawZombies()}
                    {drawExit()}
                    {drawPit(5)}
                  </> :
                  <div>
                    <h1 id="instruction-text" onClick={() => startGame(true)}>Skater Vs Zombies Press Space Bar</h1>
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
