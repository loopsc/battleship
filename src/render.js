export function setupScreen() {
    const main = document.getElementById("main");

    const board = document.createElement("div");
    board.classList.add("board");

    const playerNameInput = document.createElement("input");
    playerNameInput.setAttribute("type", "text");
    playerNameInput.setAttribute("placeholder", "Player Name");
    playerNameInput.classList.add("player-name-input");

    const startGameButton = document.createElement("button");
    startGameButton.classList.add("button");
    startGameButton.textContent = "Start Game";

    main.appendChild(playerNameInput);
    main.appendChild(board);
    main.appendChild(startGameButton);

    generateGrid(board);
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
