
function drawHuman(human) {
    return human.map((segment, index) => (
        <div key={index} className="human" style={{ gridColumnStart: segment.x, gridRowStart: segment.y }}>
            S
        </div>
    ));
}

function drawZombies(zombies) {
    return zombies.map((zombiePos, index) => (
        <div key={index} className="zombie" style={{ gridColumnStart: zombiePos.x, gridRowStart: zombiePos.y }}>
            Z
        </div>
    ));
}

function drawExit(exit) {
    return exit.map((exitPos, index) => (
        <div key={index} className="exit" style={{ gridColumnStart: exitPos.x, gridRowStart: exitPos.y }}>
            E
        </div>
    ));
}
function drawPit(sandPits) {
    return sandPits.map((sandPos, index) => (
        <div key={index} className="sand" style={{ gridColumnStart: sandPos.x, gridRowStart: sandPos.y }}>
            P
        </div>
    ));
}

export { drawHuman, drawZombies, drawExit, drawPit }