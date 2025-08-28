import { PlayerSetup, getHoverCells } from "../game-configs";

export function setupScreen() {
    return renderSetupScreen();
}

function renderSetupScreen() {
    const main = document.getElementById("main");

    const boardAndButtons = document.createElement("div");
    boardAndButtons.id = "board-and-buttons";

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

    boardWrapper.append(corner, colLabels, rowLabels, board);

    boardAndButtons.append(boardWrapper, buttonsMenu);

    main.appendChild(playerNameInput);
    main.appendChild(boardAndButtons);
    main.appendChild(startGameButton);

    generateAxisLabels(colLabels, rowLabels);
    generateGrid(board);

    return { startGameButton, playerNameInput };
}

// Generate the ship and orientation buttons
function generateButtons(container) {
    const shipTypes = [
        "Carrier",
        "Battleship",
        "Cruiser",
        "Submarine",
        "Destroyer",
    ];

    shipTypes.forEach((shipName) => {
        const button = document.createElement("button");
        button.classList.add("menu-buttons", "ship-button");
        button.textContent = shipName;
        button.dataset.ship = shipName.toLowerCase();

        if (button.dataset.ship === "carrier") {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {
            PlayerSetup.selectedShip = button.dataset.ship;

            // remove active class from the other buttons
            const allShipButtons = container.querySelectorAll(
                ".ship-button:not(.orientation-button)"
            );
            allShipButtons.forEach((btn) => btn.classList.remove("active"));
            // add active class to the clicked button
            button.classList.add("active");
        });

        container.appendChild(button);
    });

    const orientationButton = document.createElement("button");
    orientationButton.classList.add(
        "menu-buttons",
        "ship-button",
        "orientation-button"
    );
    orientationButton.textContent = "Horizontal";
    orientationButton.dataset.orientation = "horizontal";
    orientationButton.addEventListener("click", () => {
        const current = orientationButton.dataset.orientation;
        const next = current === "horizontal" ? "vertical" : "horizontal";
        orientationButton.dataset.orientation = next;

        PlayerSetup.selectedOrientation = orientationButton.dataset.orientation;

        orientationButton.textContent =
            next.charAt(0).toUpperCase() + next.slice(1);
    });
    container.appendChild(orientationButton);
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

// Generate the grid
function generateGrid(container, gridSize = 10) {
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const cell = document.createElement("div");
            cell.dataset.x = x;
            cell.dataset.y = y;

            cell.addEventListener("click", () => {
                console.log(`Clicked ${x}, ${y}`);
                if (PlayerSetup.playerBoard.allShipsPlaced()) {
                    return;
                }

                // Arra of cell coordinates that a ship will occupy
                const highlightedCells = getHoverCells(
                    x,
                    y,
                    PlayerSetup.selectedShip,
                    PlayerSetup.selectedOrientation
                );

                // Do nothing if the ship cannot be placed there
                if (
                    !PlayerSetup.playerBoard.canPlaceShips(
                        x,
                        y,
                        PlayerSetup.selectedShip,
                        PlayerSetup.selectedOrientation
                    )
                ) {
                    alert("Ship cannot be placed here");
                    return;
                }

                //Place ship logic
                PlayerSetup.playerBoard.placeShip(
                    x,
                    y,
                    PlayerSetup.selectedShip,
                    PlayerSetup.selectedOrientation
                );

                // Highlight the cells to indicate ship has been placed
                for (const [cx, cy] of highlightedCells) {
                    highlight(cx, cy, container, "placed");
                }

                // Disable the button when the ship is placed down
                disableShipButton(PlayerSetup.selectedShip);

                console.log("Ships:", PlayerSetup.playerBoard.ships);
            });

            // Hover logic
            cell.addEventListener("mouseenter", () => {
                if (PlayerSetup.playerBoard.allShipsPlaced()) {
                    return;
                }

                const highlightedCells = getHoverCells(
                    x,
                    y,
                    PlayerSetup.selectedShip,
                    PlayerSetup.selectedOrientation
                );

                const validPlacement = PlayerSetup.playerBoard.canPlaceShips(
                    x,
                    y,
                    PlayerSetup.selectedShip,
                    PlayerSetup.selectedOrientation
                );

                // Add the appropriate hover class to all cells the ship would occupy
                const hoverClass = validPlacement
                    ? "hover-valid"
                    : "hover-invalid";
                for (const [cx, cy] of highlightedCells) {
                    highlight(cx, cy, container, hoverClass);
                }
            });

            cell.addEventListener("mouseleave", () => {
                clearHighlight(container);
            });

            container.appendChild(cell);
        }
    }
}

/**
 *
 * @param {Number} x X coordinate
 * @param {*} y Y coordinate
 * @param {*} container Grid div element
 * @param {String} styleClass CSS selected classname
 */
export function highlight(x, y, container, styleClass) {
    const cell = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
    if (cell) {
        cell.classList.add(styleClass);
    }
}

// Clear all highlights
function clearHighlight(container) {
    const hoveredCells = container.querySelectorAll(
        ".hover-valid, .hover-invalid"
    );
    hoveredCells.forEach((cell) =>
        cell.classList.remove("hover-valid", "hover-invalid")
    );
}

// Sets a button to be disabled
function disableShipButton(shipDataset) {
    const btn = document.querySelector(`button[data-ship = ${shipDataset}]`);
    if (!btn) return;

    btn.classList.remove("active");
    btn.classList.add("disabled");

    const allShipButtons = document.querySelectorAll(
        ".ship-button:not(.orientation-button)"
    );

    for (const nextBtn of allShipButtons) {
        if (!nextBtn.classList.contains("disabled")) {
            nextBtn.classList.add("active");
            PlayerSetup.selectedShip = nextBtn.dataset.ship;
            break;
        }
    }
}
