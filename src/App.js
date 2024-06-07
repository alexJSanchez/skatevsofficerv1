import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  // Define game variables using useState hook
  const [gridSize, setGridSize] = useState(20);
  const [human, setHuman] = useState([{ x: 10, y: 10 }]);
  const [zombies, setZombies] = useState(randomGridPosition());
  const [exit, setExit] = useState(randomGridPosition());
  const [sandPits, setSandPits] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Generate exit position
  function generateExit() {
    // Your generateExit logic here
  }

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
  // DrawZombies
  function drawZombies(amount) {
    const zombiePositions = [];
    for (let i = 0; i < amount; i++) {
      zombiePositions.push(randomGridPosition());
    }

    return zombiePositions.map((zombiePos, index) => (
      <div key={index} className="zombie" style={{ gridColumnStart: zombiePos.x, gridRowStart: zombiePos.y }}>
        Z
      </div>
    ));
  }
  // draw Exit
  function drawExit(amount) {
    const exitPositions = [];
    for (let i = 0; i < amount; i++) {
      exitPositions.push(randomGridPosition());
    }

    return exitPositions.map((exitPos, index) => (
      <div key={index} className="exit" style={{ gridColumnStart: exitPos.x, gridRowStart: exitPos.y }}>
        E
      </div>
    ));
  }

  //random grid position
  function randomGridPosition() {
    let position;
    do {
      position = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (position.x === 10 && position.y === 10); // Ensure position is not at initial human position
    return position;
  }



  useEffect(() => {
    startGame(true)
  }, [])

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
                {gameStarted ? "" :
                  <div>
                    <h1 id="instruction-text">Skater Vs Zombies Press Space Bar</h1>
                    <img id="logo" src="HULKGREY.png" alt="snake-logo" />
                    <div id="gameInstructions">
                      <p>These are the instructions to the game</p>
                    </div>
                  </div>
                }
                {drawHuman()}
                {drawZombies(3)}
                {drawExit(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
