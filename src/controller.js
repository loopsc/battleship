import { setupScreen, highlight } from "./modules/ui/renderSetup";
import { renderGame } from "./modules/ui/renderGame";
import { BotSetup, PlayerSetup, getHoverCells } from "./modules/game-configs";

export function startGame(gameController) {
    const { startGameButton, playerNameInput } = setupScreen();
    startGameButton.addEventListener("click", () => {
        // Error check
        if (!PlayerSetup.playerBoard.allShipsPlaced()) {
            throw new Error("Place all ships");
        }

        // Set a default name if none given
        PlayerSetup.playerName = playerNameInput.value || "Player";

        clearScreen();
        renderGame(gameController);
    });
}

export class GameController {
    constructor() {
        this.playerBoard = PlayerSetup.playerBoard;
        this.botBoard = BotSetup.botBoard;
        this.currentTurn = "player";
    }

    playerAttack(x, y, container, label) {
        if (this.currentTurn !== "player") return;

        const result = this.botBoard.receiveAttack(x, y);

        if (result === "already-attacked") {
            if (label) {
                if (result === "already-attacked")
                label.textContent = "Hit another spot";
            }
            return;
        }

        // Update visuals
        const cell = container.querySelector(`[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            if (result === "miss") cell.classList.add("miss-ship");
            else if (result === "hit") cell.classList.add("hit-ship");
            else if (result === "sunk") {
                const attackedPosition = this.botBoard.board[x][y];
                const [headX, headY] = this.botBoard.getHead(
                    x,
                    y,
                    attackedPosition.ship.orientation
                );
                const cellsToHighlight = getHoverCells(
                    headX,
                    headY,
                    attackedPosition.ship.type,
                    attackedPosition.ship.orientation
                );
                for (const [cx, cy] of cellsToHighlight) {
                    highlight(cx, cy, container, "sunk-ship");
                }
            }
        }

        if (label) {
            label.textContent = `${
                PlayerSetup.playerName
            } attacked ${translateCoords(x, y)}: ${result}`;
        }

        if (this.botBoard.isAllShipsSunk()) {
            setTimeout(() => {
                alert(`${PlayerSetup.playerName} has won!`);
            }, 0);
        }

        this.#takeBotTurn(label);
        this.#takeBotTurn(label);

        return result;
    }

    botAttack(label) {
        if (this.currentTurn !== "bot") return;

        let x, y, result;
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            result = this.playerBoard.receiveAttack(x, y);
        } while (result === "already-attacked");

        console.log(`Bot attacked ${x},${y}: ${result}`);

        // Update visuals
        const playerCell = document.querySelector(
            `.player-cell[data-x="${x}"][data-y="${y}"]`
        );
        if (!playerCell) return;

        if (result === "hit") playerCell.classList.add("hit-ship");
        else if (result === "miss") playerCell.classList.add("miss-ship");
        else if (result === "sunk") {
            const attackedPosition = this.playerBoard.board[x][y];
            const [headX, headY] = this.playerBoard.getHead(
                x,
                y,
                attackedPosition.ship.orientation
            );
            const cellsToHighlight = getHoverCells(
                headX,
                headY,
                attackedPosition.ship.type,
                attackedPosition.ship.orientation
            );
            for (const [cx, cy] of cellsToHighlight) {
                const cell = document.querySelector(
                    `.player-cell[data-x="${cx}"][data-y="${cy}"]`
                );
                cell?.classList.add("sunk-ship");
            }
        }

        if (label) {
            label.textContent = `${BotSetup.botName} attacked ${translateCoords(
                x,
                y
            )}: ${result}`;
        }

        if (this.playerBoard.isAllShipsSunk()) {
            console.log("Bot wins!");
            return;
        }

        this.currentTurn = "player";
    }

    #takeBotTurn(label) {
        this.currentTurn = "bot";
        setTimeout(() => {
            this.botAttack(label);
        }, 1000);
    }
}

function clearScreen() {
    const main = document.getElementById("main");
    main.innerHTML = "";
}
/**
 * Convert numeric coordinates to Battleship-style coordinates
 * @param {number} x - 0–9 column index
 * @param {number} y - 0–9 row index
 * @returns {string} Example: "A1", "D5", "J10"
 */
function translateCoords(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) {
        throw new Error("Coordinates must be between 0 and 9");
    }
    const letter = String.fromCharCode(65 + x);
    const number = y + 1;
    return `${letter}${number}`;
}
