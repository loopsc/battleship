import { highlight } from "../ui/renderSetup";
import { BotSetup, PlayerSetup } from "../core/game-configs";
import { getHoverCells } from "../utils/utils";
import { translateCoords } from "../utils/utils";

class GameController {
    constructor() {
        this.playerBoard = PlayerSetup.playerBoard;
        this.botBoard = BotSetup.botBoard;
        this.currentTurn = "player";

        // Successful hits on a ship that is not sunk yet
        this.botHits = [];
        // Cells to hit next
        this.botTargets = [];
    }

    playerAttack(x, y, container) {
        if (this.currentTurn !== "player") return;

        const result = this.botBoard.receiveAttack(x, y);

        if (result === "already-attacked") {
            return "already-attacked";
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

        if (this.botBoard.isAllShipsSunk()) {
            setTimeout(() => {
                alert(`${PlayerSetup.playerName} has won!`);
            }, 0);
        }

        this.#takeBotTurn();

        return result;
    }

    botAttack() {
        if (this.currentTurn !== "bot") return;

        let x, y, result;

        if (this.botTargets.length > 0) {
            [x, y] = this.botTargets.shift();
        } else {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }

        result = this.playerBoard.receiveAttack(x, y);

        if (result === "already-attacked") {
            return this.botAttack();
        }

        if (result === "hit") {
            this.botHits.push([x, y]);
            this.#enqueueAdjacentCells(x, y);
        } else if (result === "sunk") {
            // Create a new array of coordinates of cells which have a ship and are not sunk
            this.botHits = this.botHits.filter(([x, y]) => {
                const cell = this.playerBoard.board[x][y];
                // Check that the cell has a ship object in the cell and that it is not sunk
                return cell?.ship && !cell.ship.isSunk();
            });

            // Reset cells to target
            this.botTargets = [];
            for (const [dx, dy] of this.botHits) {
                this.#enqueueAdjacentCells(dx, dy);
            }
        }

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
        const gameText = document.querySelector(".game-master-text");
        if (gameText) {
            gameText.textContent = `${
                BotSetup.botName
            } attacked ${translateCoords(x, y)}: ${result}`;
        }

        // Check if game is over and bot wins
        if (this.playerBoard.isAllShipsSunk()) {
            alert("Bot wins");
            return;
        }

        this.currentTurn = "player";
        return result;
    }

    #takeBotTurn() {
        this.currentTurn = "bot";
        setTimeout(() => {
            this.botAttack();
        }, 500);
    }

    #enqueueAdjacentCells(x, y) {
        const candidates = [
            [x - 1, y],
            [x + 1, y],
            [x, y - 1],
            [x, y + 1],
        ];

        for (const [dx, dy] of candidates) {
            if (
                dx >= 0 &&
                dx < 10 &&
                dy >= 0 &&
                dy < 10 &&
                // Prevent duplicates
                !this.botTargets.some(([hx, hy]) => hx === dx && hy === dy)
            ) {
                this.botTargets.push([dx, dy]);
            }
        }
    }
}

export const gameController = new GameController();
