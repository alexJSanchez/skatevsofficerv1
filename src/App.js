import React, { useEffect, useState } from 'react';
import './App.css';

function App() {

  // Define game variables using useState hook
  const [human, setHuman] = useState([{ x: 10, y: 10 }]);
  const [zombies, setZombies] = useState([]);
  const [exit, setExit] = useState(generateExit());
  const [sandPits, setSandPits] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState(0);

  // Generate exit position
  function generateExit() {
    // Your generateExit logic here
  }

  // Start game function
  function startGame() {
    setGameStarted(true);
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


  // Create a game element (human, zombie, exit)
  function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className;
    return element;
  }

  // Set element position on the grid
  function setPosition(element, position) {
    element.style.gridColumnStart = position.x;
    element.style.gridRowStart = position.y;
  }

  useEffect(() => {
    startGame()
    drawHuman()
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
