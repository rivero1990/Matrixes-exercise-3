const gridSize = 10;
const playerStartPosition = { x: 0, y: 0};
const exitPosition = { x: gridSize - 1, y: gridSize - 1 };
const enemyCount = 12;
const catCount = 4;
const dogCount = 4;

let playerPosition = { ...playerStartPosition };
let enemies = [];
let gameInterval;
let gamePaused= false;


/* Initialize player position , enemy array and game interval */

document.addEventListener("keydown", (event) => {
    if (!gamePaused) {
        movePlayer(event.key);
        updateGrid();

        for (let i = 0; i < enemyCount; i++) {
            if (playerPosition.x === enemies[i].x && playerPosition.y === enemies[i].y) {
                clearInterval(gameInterval);
                showLossMessage();
                gamePaused= true; // Pausa el juego
                return;
            }
        }

        if (playerPosition.x === exitPosition.x && playerPosition.y === exitPosition.y) {
            clearInterval(gameInterval);
            showWinMessage();
            gamePaused= true; // Pausa el juego
        }
    }
});


/**
 * Create the game grid dynamically
 */
function createGrid() {
    let gridContainer = document.getElementById("game-container");
    gridContainer.innerHTML = "";

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        
        let playerElement = document.createElement("div");
        playerElement.classList.add("player");
        
        let enemyElement = document.createElement("div");
        enemyElement.classList.add("enemy");
        
        cell.appendChild(playerElement);
        cell.appendChild(enemyElement);
        
        gridContainer.appendChild(cell);
    }
}


/**
 * Update the game grid to display player, exit, cheese, and enemies
 */
function updateGrid() {
    
    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.innerHTML = '');

    for (let i = 0; i < enemyCount; i++) {
        let enemy = enemies[i];
        let enemyCell = cells[enemy.y * gridSize + enemy.x];
        enemyCell.innerHTML = enemy.type; 
        enemyCell.classList.add("enemy-cell");
    }

    let playerCell = cells[playerPosition.y * gridSize + playerPosition.x];
    let exitCell = cells[exitPosition.y * gridSize + exitPosition.x];

    if (playerPosition.x === exitPosition.x && playerPosition.y === exitPosition.y) {
        playerCell.innerHTML = "🐭";
        playerCell.classList.add("player-cell");
        exitCell.innerHTML = "🐭"; // Muestra al jugador en la casilla del queso
        exitCell.classList.add("exit-cell");
    } else {
        // Si el jugador no llega al queso, muestra al jugador en su casilla y el queso en su casilla
        playerCell.innerHTML = "🐭";
        playerCell.classList.add("player-cell");
        exitCell.innerHTML = "🧀";
        exitCell.classList.add("exit-cell");
    }

    renderEnemy(cells);
}


/* Displays the enemies on the game grid and handles collisions with the player */

function renderEnemy(cells) {
    for (let i = 0; i < enemyCount; i++) {
        const enemy = enemies[i];
        if (playerPosition.x === enemy.x && playerPosition.y === enemy.y) {
            let enemyCell = cells[enemy.y * gridSize + enemy.x];
            enemyCell.innerHTML = enemy.type;
            enemyCell.classList.add("enemy-cell");
        }
    }
}


/* Displays a message that the user lost */

function showLossMessage() {
    
    gamePaused = true;

    let { buttonContainer, yesButton, noButton, message } = createLossModal();

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);

    let modalLoss = document.createElement("div");
    modalLoss.className = "modal-loss";
    modalLoss.appendChild(message);
    modalLoss.appendChild(buttonContainer);
    document.body.appendChild(modalLoss);

    let cells = document.querySelectorAll(".cell");
    let lostCell = cells[playerPosition.y * gridSize + playerPosition.x];
    lostCell.style.backgroundColor = "orange";

    handleClickLoss(yesButton, lostCell, modalLoss, noButton); 
}


/* Manages user interface click events */

function handleClickLoss(yesButton, lostCell, modalLoss, noButton) { 
    yesButton.addEventListener("click", function () {
        resetGame();
        lostCell.style.backgroundColor = "";
        modalLoss.style.display = "none";
    });

    noButton.addEventListener("click", function () {
        lostCell.style.backgroundColor = "";
        modalLoss.style.display = "none";
    });
}

/* Create a modal dialog to display a loss message in the game with "Yes" and "No" options */

function createLossModal() {
    let modalLoss = document.createElement("div");
    let message = document.createElement("p");
    let buttonContainer = document.createElement("div");
    let yesButton = document.createElement("button");
    let noButton = document.createElement("button");

    modalLoss.className = "modal-loss";
    message.textContent = "¡You Lost! ¿Do You Want To Try Again?";
    yesButton.textContent = "Yes";
    noButton.textContent = "No";
    return { buttonContainer, yesButton, noButton, modalLoss, message };
}


/* Displays a message that the user win */

function showWinMessage() {
    gamePaused = true;

    let { buttonContainer, yesButton, noButton, message } = createWinModal();

    buttonContainer.appendChild(yesButton);
    buttonContainer.appendChild(noButton);

    modalWin = document.createElement("div"); // Define modalWin
    modalWin.className = "modal-win";
    modalWin.appendChild(message);
    modalWin.appendChild(buttonContainer);
    document.body.appendChild(modalWin);

    handleClickWin(yesButton, noButton, modalWin); // Asegúrate de pasar modalWin aquí
}


/* Manages user interface click events */

function handleClickWin(yesButton, noButton, modalWin) {
    yesButton.addEventListener("click", function () {
        resetGame();
        modalWin.style.display = "none";
    });

    noButton.addEventListener("click", function () {
        modalWin.style.display = "none";
    });
}

/* Create a modal dialog to display a win message in the game with "Yes" and "No" options */ 

function createWinModal() {
    let modalWin = document.createElement("div");
    let message = document.createElement("p");
    let buttonContainer = document.createElement("div");
    let yesButton = document.createElement("button");
    let noButton = document.createElement("button");

    modalWin.className = "modal-win";
    message.textContent = "¡You Win! ¿Do You Want To Play Again?";
    yesButton.textContent = "Yes";
    noButton.textContent = "No";
    return { buttonContainer, yesButton, noButton, modalWin, message };
}


/**
 * Move the player based on keyboard input
 * @param {*string} key The key pressed by the player ('ArrowLeft', 'ArrowRight', 'ArrowUp', or 'ArrowDown')
 */
function movePlayer(key) {
    
    switch (key) {
        case "ArrowLeft":
            if (playerPosition.x > 0) {
                playerPosition.x--;
            }
            break;
        case "ArrowRight":
            if (playerPosition.x < gridSize - 1) {
                playerPosition.x++;
            }
            break;
        case "ArrowUp":
            if (playerPosition.y > 0) {
                playerPosition.y--;
            }
            break;
        case "ArrowDown":
            if (playerPosition.y < gridSize - 1) {
                playerPosition.y++;
            }
            break;
    }
}



/**
 * Move the enemies randomly on the grid
 */
function moveEnemies() {
    for (let i = 0; i < enemyCount; i++) {
        let directions = ["up", "left", "down", "right"];
        let randomDirection = directions[Math.floor(Math.random() * directions.length)];

        let enemy = enemies[i];
        let currentX = enemy.x;
        let currentY = enemy.y;

        switch (randomDirection) {
            case "up":
                if (enemy.y > 0) {
                    enemy.y--;
                }
                break;
            case "left":
                if (enemy.x > 0) {
                    enemy.x--;
                }
                break;
            case "down":
                if (enemy.y < gridSize - 1) {
                    enemy.y++;
                }
                break;
            case "right":
                if (enemy.x < gridSize - 1) {
                    enemy.x++;
                }
                break;
        }

        if (enemy.x === exitPosition.x && enemy.y === exitPosition.y) {
            enemy.x = currentX;
            enemy.y = currentY;
        }
    }
}



/**
 * Reset the game to its initial state
 */
function resetGame() {
    gamePaused= false;
    playerPosition = { ...playerStartPosition };
    enemies = [];
    clearInterval(gameInterval);
    createGrid();
    initializeEnemies();
    updateGrid();
    startGame();
}


/**
 * Initialize enemy positions, ensuring they don't start near the player
 */
function initializeEnemies() {
    
    let availablePositions = [];

    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            availablePositions.push({ x, y });
        }
    }

    const getRandomPosition = () => {
        let randomIndex = Math.floor(Math.random() * availablePositions.length);
        return availablePositions.splice(randomIndex, 1)[0];
    };

    for (let i = 0; i < enemyCount; i++) {
        let enemyType = "🐱"; 
        if (i >= catCount && i < catCount + dogCount) {
            enemyType = "🐶"; 
        } else if (i >= catCount + dogCount) {
            enemyType = "🦊"; 
        }

        let position = getRandomPosition();
        enemies.push({ x: position.x, y: position.y, type: enemyType });
    }
}


/**
 * Start the game loop
 */
function startGame() {

    gameInterval = setInterval(() => {
        moveEnemies();
        updateGrid();

        for (let i = 0; i < enemyCount; i++) {
            if (playerPosition.x === enemies[i].x && playerPosition.y === enemies[i].y) {
                clearInterval(gameInterval);
                showLossMessage();
                return;
            }
        }

        if (playerPosition.x === exitPosition.x && playerPosition.y === exitPosition.y) {
            clearInterval(gameInterval);
            showWinMessage();
        }
    }, 500);
}


/* Create the initial game grid, initialize enemies, and start the game */
createGrid();
initializeEnemies();
updateGrid();
startGame();




