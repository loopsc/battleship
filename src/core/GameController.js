import { highlight } from "../ui/renderSetup";
import { BotSetup, PlayerSetup } from "../core/game-configs";
import { getHoverCells, translateCoords } from "../utils/utils";

class GameController {
    constructor() {
        this.playerBoard = PlayerSetup.playerBoard;
        this.botBoard = BotSetup.botBoard;
        this.currentTurn = "player";

        // Successful hits on a ship that is not sunk yet
        this.hitCells = [];
        // Cells to hit next
        this.attackQueue = [];
        this.discoveredOrientation = null;
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
            alert(`${PlayerSetup.playerName} has won!`);
            return;
        }

        this.takeBotTurn();

        return result;
    }

    botAttack() {
        if (this.currentTurn !== "bot") return;

        let x, y, result;

        // Focus on a ship or target randomly
        if (this.attackQueue.length > 0) {
            [x, y] = this.attackQueue.shift();
        } else {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
        }

        // result can be: "hit", "miss", "already-attacked", "sunk"
        result = this.playerBoard.receiveAttack(x, y);

        // If attacking an already hit cell, recursively call and return a valid attack result
        if (result === "already-attacked") {
            return this.botAttack();
        }

        if (result === "hit") {
            this.hitCells.push([x, y]);

            // Second hit on a ship, figure out its orientation.
            if (this.hitCells.length === 2) {
                const [firstAttack, secondAttack] = this.hitCells;
                if (firstAttack[0] === secondAttack[0])
                    this.discoveredOrientation = "vertical";
                else if (firstAttack[1] === secondAttack[1])
                    this.discoveredOrientation = "horizontal";
            }

            this.enqueueAdjacentCells(x, y);
        } else if (result === "sunk") {
            // Filter out the coordinates of the ship that has just been sunk
            // Allows bot to continue targeting adjacent squares of ships that have been previously hit but were not part of the sunk ship
            this.hitCells = this.hitCells.filter(([x, y]) => {
                const cell = this.playerBoard.board[x][y];
                // Check that the cell has a ship object in the cell and that it is not sunk
                return cell?.ship && !cell.ship.isSunk();
            });

            // Reset targeting logic configs
            this.attackQueue = [];
            this.discoveredOrientation = null;
            // If there are left over hits of ships not sunk, queue up attacks.
            for (const [dx, dy] of this.hitCells) {
                this.enqueueAdjacentCells(dx, dy);
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
            alert(`${BotSetup.botName} wins!`);
            return;
        }

        this.currentTurn = "player";
        return result;
    }

    takeBotTurn() {
        this.currentTurn = "bot";
        setTimeout(() => {
            this.botAttack();
        }, 500);
    }

    enqueueAdjacentCells(x, y) {
        let candidates = [];

        if (this.discoveredOrientation === "vertical") {
            candidates = [
                [x, y - 1],
                [x, y + 1],
            ];
        } else if (this.discoveredOrientation === "horizontal") {
            candidates = [
                [x - 1, y],
                [x + 1, y],
            ];
            // Orientation not discovered, try adjacent cells
        } else {
            candidates = [
                [x - 1, y],
                [x + 1, y],
                [x, y - 1],
                [x, y + 1],
            ];
        }

        // Ensure attacks must be within board boundaries
        for (const [dx, dy] of candidates) {
            if (
                dx >= 0 &&
                dx < 10 &&
                dy >= 0 &&
                dy < 10 &&
                // Prevent duplicates
                !this.attackQueue.some(([hx, hy]) => hx === dx && hy === dy)
            ) {
                this.attackQueue.push([dx, dy]);
            }
        }
    }
}

export const gameController = new GameController();
