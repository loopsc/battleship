import { PlayerSetup, BotSetup } from "../game-configs";

export function renderGame(gameController) {
    const main = document.getElementById("main");

    const gameMasterText = document.createElement("lable");
    gameMasterText.classList.add("game-master-text");
    gameMasterText.textContent = "Fire your first shot!";

    const parentContainer = document.createElement("div");
    parentContainer.classList.add("game-parent-container");

    main.appendChild(parentContainer);

    const playerContainer = document.createElement("div");
    playerContainer.classList.add("game-player-container");

    const playerLabel = document.createElement("label");
    playerLabel.classList.add("game-labels");
    playerLabel.textContent = PlayerSetup.playerName;

    playerContainer.appendChild(playerLabel);

    const botContainer = document.createElement("div");
    botContainer.classList.add("game-bot-container");

    const botLabel = document.createElement("label");
    botLabel.classList.add("bot-labels");
    botLabel.textContent = "Beep Boop";

    botContainer.appendChild(botLabel);

    renderComponents(playerContainer);
    renderComponents(botContainer, false, gameController, gameMasterText);

    parentContainer.appendChild(playerContainer);
    parentContainer.appendChild(gameMasterText);
    parentContainer.appendChild(botContainer);
}

// Creates the boards, labels, ships
function renderComponents(
    container,
    player = true,
    gameController = null,
    gameMasterText
) {
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
        generateGrid(board, playerBoard, true);
    } else {
        const botBoard = BotSetup.botBoard;
        botBoard.randomize();
        generateGrid(board, botBoard, false, gameController, gameMasterText);
    }
}

function generateGrid(
    container,
    gameboard,
    isPlayer = false,
    gameController = null,
    gameMasterText = null,
    gridSize = 10
) {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement("div");
            cell.dataset.x = x;
            cell.dataset.y = y;

            // Highlight the ships only on the player board
            if (isPlayer) {
                cell.classList.add("player-cell");

                if (gameboard.board[x][y]) {
                    cell.classList.add("placed");
                }
            }
            // Can only interact with bot board
            else {
                cell.classList.add("bot-cell");

                cell.addEventListener("click", () => {
                    if (
                        !gameController ||
                        gameController.currentTurn !== "player"
                    )
                        return;

                    // Perform the attack
                    gameController.playerAttack(
                        x,
                        y,
                        container,
                        gameMasterText
                    );
                });
            }

            // Hover logic
            cell.addEventListener("mouseenter", () => {
                cell.classList.add("ingame-hover");
            });

            cell.addEventListener("mouseleave", () => {
                cell.classList.remove("ingame-hover");
            });

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
