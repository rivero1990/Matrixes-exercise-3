const gridSize = 10;
const playerStartPosition = { x: 0, y: 0};
const exitPosition = { x: gridSize - 1, y: gridSize - 1 };
const enemyCount = 13;


let playerPosition = { ...playerStartPosition };
let enemies = [];
let gameInterval;


document.addEventListener("keydown", (event) => {
    movePlayer(event.key);
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
});



function createGrid() {

    let gridContainer = document.getElementById("game-container");
    gridContainer.innerHTML = "";

    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridContainer.appendChild(cell);
    }
}


function updateGrid() {

    let cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => cell.innerHTML = '');

    let playerCell = cells[playerPosition.y * gridSize + playerPosition.x];
    playerCell.innerHTML = "🐭";
    playerCell.classList.add("player-cell");

    let exitCell = cells[exitPosition.y * gridSize + exitPosition.x];
    exitCell.innerHTML = "🧀";
    exitCell.classList.add("exit-cell");

    for (let i = 0; i < enemyCount; i++) {
        let enemyCell = cells[enemies[i].y * gridSize + enemies[i].x];
        enemyCell.innerHTML = "😺";
        enemyCell.classList.add("enemy-cell");
    }
}

function showWinMessage() {
    
    let restart = confirm("¡You Win! ¿Do You Want To Play Again?");
    if (restart) {
        resetGame();
    }
}

function showLossMessage() {
    
    let restart = confirm("¡You Lost! ¿Do You Want To Try Again?");
    if (restart) {
        resetGame();
    }
}

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

function moveEnemies() {
    
    for (let i = 0; i < enemyCount; i++) {
        let directions = ["up", "left", "down", "right"];
        let randomDirection = directions[Math.floor(Math.random() * directions.length)];

        let enemy = enemies[i];

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
    }
}


function resetGame() {
    
    playerPosition = { ...playerStartPosition };
    enemies = [];
    clearInterval(gameInterval);
    createGrid();
    initializeEnemies();
    updateGrid();
    startGame();
}

function initializeEnemies() {
    for (let i = 0; i < enemyCount; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridSize);
            y = Math.floor(Math.random() * gridSize);
        } while ((x >= playerPosition.x - 2 && x <= playerPosition.x + 2) && 
                 (y >= playerPosition.y - 2 && y <= playerPosition.y + 2));
        enemies.push({ x, y });
    }
}

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


createGrid();
initializeEnemies();
updateGrid();
startGame();




