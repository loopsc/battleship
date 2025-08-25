import { PlayerSetup, BotSetup } from "./modules/GameSetup";
import { Gameboard } from "./modules/objects/Gameboard";

export function renderGame() {
    const main = document.getElementById("main");

    const parentContainer = document.createElement("div");
    parentContainer.classList.add("game-parent-container");

    main.appendChild(parentContainer)

    const playerContainer = document.createElement("div");
    playerContainer.classList.add("game-player-container");

    const playerLabel = document.createElement("label");
    playerLabel.classList.add("game-labels");
    playerLabel.textContent = "Player";

    playerContainer.appendChild(playerLabel)

    const botContainer = document.createElement("div");
    botContainer.classList.add("game-bot-container");

    const botLabel = document.createElement("label");
    botLabel.classList.add("bot-labels");
    botLabel.textContent = "Beep Boop";

    botContainer.appendChild(botLabel)

    renderComponents(playerContainer);
    renderComponents(botContainer, false);

    parentContainer.appendChild(playerContainer);
    parentContainer.appendChild(botContainer);
}

// Creates the boards, labels, ships
function renderComponents(container, player = true) {
    const boardWrapper = document.createElement("div");
    boardWrapper.classList.add("board-wrapper");

    const corner = document.createElement("div");
    corner.classList.add("corner-cell");

    const colLabels = document.createElement("div");
    colLabels.classList.add("col-labels");

    const rowLabels = document.createElement("div");
    rowLabels.classList.add("row-labels");

    const board = document.createElement("div");
    board.classList.add("board");

    boardWrapper.append(corner, colLabels, rowLabels, board);

    container.append(boardWrapper);

    generateAxisLabels(colLabels, rowLabels);
    if (player === true) {
        const playerBoard = PlayerSetup.playerBoard;
        generateGrid(board, playerBoard);
    } else {
        const botBoard = BotSetup.botBoard;
        botBoard.randomize()
        generateGrid(board, botBoard);
    }
}

function generateGrid(container, gameboard, gridSize = 10) {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement("div");
            cell.dataset.x = x;
            cell.dataset.y = y;

            if (gameboard.board[x][y]) {
                cell.classList.add("placed");
            }

            cell.addEventListener("click", () => {
                console.log(`Clicked ${x}, ${y}`);
            });

            // Hover logic
            cell.addEventListener("mouseenter", () => {});

            cell.addEventListener("mouseleave", () => {});

            container.appendChild(cell);
        }
    }
}

// Generate the labels for the grid
function generateAxisLabels(colContainer, rowContainer) {
    for (let i = 0; i < 10; i++) {
        const colLabel = document.createElement("div");
        colLabel.textContent = String.fromCharCode(65 + i); // A–J
        colLabel.classList.add("axis-text");
        colContainer.appendChild(colLabel);

        const rowLabel = document.createElement("div");
        rowLabel.textContent = i + 1; // 1–10
        rowLabel.classList.add("axis-text");
        rowContainer.appendChild(rowLabel);
    }
}
