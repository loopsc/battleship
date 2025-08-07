import { GameManager } from "./modules/GameManager";

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
    const shipTypes = ["Carrier", "Battleship", "Cruiser", "Submarine", "Destroyer"];

    shipTypes.forEach(shipName => {
        const button = document.createElement("button");
        button.classList.add("menu-buttons", "ship-button");
        button.textContent = shipName;
        button.dataset.ship = shipName.toLowerCase();

        button.addEventListener("click", () => {
            GameManager.selectedShip = button.dataset.ship

            // remove active class from the other buttons
            const allShipButtons = container.querySelectorAll(".ship-button:not(.orientation-button)");
            allShipButtons.forEach(btn => btn.classList.remove("active"));
            // add active class to the clicked button
            button.classList.add("active")
        })

        container.appendChild(button)
    })

    const orientationButton = document.createElement("button");
    orientationButton.classList.add("menu-buttons", "ship-button", "orientation-button");
    orientationButton.textContent = "Horizontal";
    orientationButton.dataset.orientation = "horizontal";
    orientationButton.addEventListener("click", () => {
        const current = orientationButton.dataset.orientation;
        const next = current === "horizontal" ? "vertical" : "horizontal";
        orientationButton.dataset.orientation = next;
        orientationButton.textContent = next.charAt(0).toUpperCase() + next.slice(1)
    })
    container.appendChild(orientationButton)
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

            // Hover logic
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
