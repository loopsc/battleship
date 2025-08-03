export function setupScreen() {
    const main = document.getElementById("main");

    const boardWrapper = document.createElement("div");
    boardWrapper.classList.add("board-wrapper");

    const corner = document.createElement("div");
    corner.classList.add("corner-cell");

    const colLabels = document.createElement("div");
    colLabels.classList.add("col-labels");

    const rowLabels = document.createElement("div");
    rowLabels.classList.add("row-labels");

    const buttonsMenu = document.createElement("div");
    buttonsMenu.classList.add("buttons-menu");

    const board = document.createElement("div");
    board.classList.add("board");

    const playerNameInput = document.createElement("input");
    playerNameInput.setAttribute("type", "text");
    playerNameInput.setAttribute("placeholder", "Player Name");
    playerNameInput.classList.add("player-name-input");

    const startGameButton = document.createElement("button");
    startGameButton.classList.add("menu-buttons");
    startGameButton.textContent = "Start Game";

    generateButtons(buttonsMenu);

    boardWrapper.appendChild(corner);
    boardWrapper.appendChild(colLabels);
    boardWrapper.appendChild(buttonsMenu);
    boardWrapper.appendChild(rowLabels);
    boardWrapper.appendChild(board);

    main.appendChild(playerNameInput);
    main.appendChild(boardWrapper);
    main.appendChild(startGameButton);

    generateAxisLabels(colLabels, rowLabels);
    generateGrid(board);
    
}

function generateButtons(container) {
    const carrierButton = document.createElement("button");
    carrierButton.classList.add("menu-buttons", "ship-button");
    carrierButton.textContent = "Carrier";

    const battleshipButton = document.createElement("button");
    battleshipButton.classList.add("menu-buttons", "ship-button");
    battleshipButton.textContent = "Battleship"

    const cruiserButton = document.createElement("button");
    cruiserButton.classList.add("menu-buttons", "ship-button");
    cruiserButton.textContent = "Cruiser"

    const subButton = document.createElement("button");
    subButton.classList.add("menu-buttons", "ship-button");
    subButton.textContent = "Submarine"

    const destroyerButton = document.createElement("button");
    destroyerButton.classList.add("menu-buttons", "ship-button");
    destroyerButton.textContent = "Destroyer"

    const orientationButton = document.createElement("button");
    orientationButton.classList.add("menu-buttons","ship-button", "orientation-button");
    orientationButton.textContent = "Horizontal";
    orientationButton.addEventListener("click", () => {
        orientationButton.textContent = orientationButton.textContent === "Horizontal" ? "Vertical" : "Horizontal";
    })


    container.append(
        carrierButton,
        battleshipButton,
        cruiserButton,
        subButton,
        destroyerButton,
        orientationButton
    );
}

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

function generateGrid(container, gridSize = 10) {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement("div");
            cell.dataset.x = x;
            cell.dataset.y = y;

            cell.addEventListener("click", () => {
                console.log(`Clicked ${x}, ${y}`);
                // Attack logic here
            });

            cell.addEventListener("mouseenter", () => {
                cell.style.backgroundColor = "lightgreen";
            });

            cell.addEventListener("mouseleave", () => {
                cell.style.backgroundColor = "";
            });

            container.appendChild(cell);
        }
    }
}

export function clearScreen() {
    document.body.innerHTML = "";
}
