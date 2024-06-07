import './App.css';

function App() {
  // Define HTML elements
  const board = document.getElementById("game-board");
  const instructionText = document.getElementById("instruction-text");
  const gameInstructions = document.getElementById("gameInstructions")
  const logo = document.getElementById("logo");
  const score = document.getElementById("score");
  const highScoreText = document.getElementById("highScore");

  // Define game variables
  const gridSize = 20;
  let human = [{ x: 10, y: 10 }];
  let zombies = [];
  let exit = generateExit();
  let sandPits = [];
  let gameStarted = false;
  let gameScore = 0;

  // Draw game map, human, zombies, exit
  function draw() {
    board.innerHTML = "";
    drawHuman();
    drawZombies();
    drawSand();
    drawExit();
  }

  // Draw human
  function drawHuman() {
    human.forEach((segment) => {
      const humanElement = createGameElement("div", "human");
      humanElement.innerHTML = "S";
      setPosition(humanElement, segment);
      board.appendChild(humanElement);
    });
  }

  // Draw zombies
  function drawZombies() {
    zombies.forEach((zombiePos) => {
      const zombieElement = createGameElement("div", "zombie");
      zombieElement.innerHTML = "Z";
      setPosition(zombieElement, zombiePos);
      board.appendChild(zombieElement);
    });
  }

  // Draw exit
  function drawExit() {
    exit.forEach((segment) => {
      const exitElement = createGameElement("div", "exit");
      exitElement.innerHTML = "E";
      setPosition(exitElement, segment);
      board.appendChild(exitElement);
    });
  }

  // Generate three random positions for the zombies
  for (let i = 0; i < 3; i++) {
    let zombiePos;
    do {
      zombiePos = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (zombiePos.x === 10 && zombiePos.y === 10);
    zombies.push(zombiePos);
  }

  // Generate ten random positions for the sand pits
  for (let i = 0; i < 10; i++) {
    let sandPit;
    do {
      sandPit = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (sandPit.x === 10 && sandPit.y === 10);
    sandPits.push(sandPit);
  }

  // Draw the sand pits on the game board
  function drawSand() {
    sandPits.forEach((sandPit) => {
      const sandElement = createGameElement("div", "sand");
      sandElement.innerHTML = "P";
      setPosition(sandElement, sandPit);
      board.appendChild(sandElement);
    });
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

  // Generate a new exit position
  function generateExit() {
    let exitPos;
    do {
      exitPos = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
    } while (exitPos.x === 10 && exitPos.y === 10); // Ensure exit is not at initial human position
    return [exitPos];
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

    human = [head];
    moveZombies();
    checkCollisions();
    draw();
  }

  // Move zombies
  function moveZombies() {
    let newZombiePositions = new Set();

    zombies = zombies.map((zombiePos) => {
      let dx = 0;
      let dy = 0;

      if (human[0].x > zombiePos.x) {
        dx = 1;
      } else if (human[0].x < zombiePos.x) {
        dx = -1;
      }

      if (human[0].y > zombiePos.y) {
        dy = 1;
      } else if (human[0].y < zombiePos.y) {
        dy = -1;
      }

      let newPos = { x: zombiePos.x + dx, y: zombiePos.y + dy };
      let newPosString = `${newPos.x},${newPos.y}`;

      // Check if the new position is already occupied by another zombie
      if (newZombiePositions.has(newPosString)) {
        // If it is, don't move this zombie
        newPos = zombiePos;
      } else {
        // Otherwise, update the position
        newZombiePositions.add(newPosString);
      }

      return newPos;
    });
  }


  // Handle keyboard events for movement
  function handleKey(event) {
    if (!gameStarted) {
      startGame();
    } else {
      switch (event.key) {
        case "w":
        case "ArrowUp":
          moveHuman(0, -1);
          break;
        case "e":
        case "ArrowUp-right":
          moveHuman(1, -1);
          break;
        case "d":
        case "ArrowRight":
          moveHuman(1, 0);
          break;
        case "c":
        case "ArrowDown-right":
          moveHuman(1, 1);
          break;
        case "x":
        case "ArrowDown":
          moveHuman(0, 1);
          break;
        case "z":
        case "ArrowDown-left":
          moveHuman(-1, 1);
          break;
        case "a":
        case "ArrowLeft":
          moveHuman(-1, 0);
          break;
        case "q":
        case "arrowLeft-up":
          moveHuman(-1, -1);
          break;
      }
    }
  }

  // Function to check for collisions
  function checkCollisions() {
    const humanHead = human[0];

    // Check if human hits zombies
    zombies.forEach((zombiePos, index) => {
      if (humanHead.x === zombiePos.x && humanHead.y === zombiePos.y) {
        gameOver("Zombie has eaten your brain");
      }
    });

    // Check if zombie fell in pit
    zombies = zombies.filter((zombiePos) => {
      for (let sandPit of sandPits) {
        if (zombiePos.x === sandPit.x && zombiePos.y === sandPit.y) {
          return false; // Exclude this zombie
        }
      }
      return true; // Keep this zombie
    });

    // Check if human hits exit
    if (humanHead.x === exit[0].x && humanHead.y === exit[0].y) {
      gameScore++
      score.innerHTML = gameScore
      gameWon("You escaped");
    }
  }
  // Disconnect Keydown
  function disconnectKeydown() {
    document.removeEventListener("keydown", handleKey);
  }

  function gameOver(text) {
    // Game over logic
    console.log(text);
    disconnectKeydown();
    highScoreText.style.display = "block"
    highScoreText.innerHTML = text
    setTimeout(function () {
      console.log('game over reset');
      resetGame();
    }, 3000); // 3000 milliseconds = 3 seconds
  }

  function gameWon(text) {
    // Game won logic
    console.log(text);
    disconnectKeydown();
    highScoreText.style.display = "block"
    highScoreText.innerHTML = text
    setTimeout(() => {
      console.log('Reseting game');
      resetGame();
    }, 3000); // 3000 milliseconds = 3 seconds
  }
  // In the startGame function, start the game loop
  function startGame() {
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = "none";
    logo.style.display = "none";
    board.style.justifyItems = "unset"
    document.addEventListener("keydown", handleKey);
    setTimeout(() => {
      gameInstructions.style.display = "ablsolute"
    }, 5000);
    draw();
  }

  function resetGame() {
    instructionText.style.display = "block";
    logo.style.display = "block";
    highScoreText.style.display = "block"
    highScoreText.innerHTML = ""
    // Define game variables
    human = [{ x: 10, y: 10 }];
    zombies = [];
    exit = generateExit();
    sandPits = [];
    for (let i = 0; i < 3; i++) {
      let zombiePos;
      do {
        zombiePos = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
      } while (zombiePos.x === 10 && zombiePos.y === 10); // Ensure zombies are not at initial human position
      zombies.push(zombiePos);
    }
    for (let i = 0; i < 10; i++) {
      let sandPit;
      do {
        sandPit = { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
      } while (sandPit.x === 10 && sandPit.y === 10); // Ensure sand pits are not at initial human position
      sandPits.push(sandPit);
    }
    gameStarted = false;
    draw();
    document.addEventListener("keydown", handleKey);
  }

  document.addEventListener("keydown", handleKey);
  return (
    <div className="App">
      <div>
        <div className="scores">
          <h1 id="score">0</h1>
          <h1 id="highScore">0</h1>
        </div>
        <div className="game-border-1">
          <div className="game-border-2">
            <div className="game-border-3">
              <div id="game-board">
                <h1 id="instruction-text">Skater Vs Zombies Press Space Bar</h1>
                <img id="logo" src="HULKGREY.png" alt="snake-logo" />
                <div id="gameInstructions">
                  <p>These are the instructions to the game</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
