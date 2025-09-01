import { highlight } from "../ui/renderSetup";
import { BotSetup, PlayerSetup } from "../core/game-configs";
import { translateCoords, getHoverCells } from "../utils/utils";

class GameController {
    constructor() {
        this.playerBoard = PlayerSetup.playerBoard;
        this.botBoard = BotSetup.botBoard;
        this.currentTurn = "player";
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

        if (this.playerBoard.isAllShipsSunk()) {
            console.log("Bot wins!");
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
}

export const gameController = new GameController();
