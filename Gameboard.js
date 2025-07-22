import { Ship, shipTypes } from "./ship";

export class Gameboard {
    constructor() {
        // Create a 2d array of null cells
        // Horizontal axis is x and horizontal axis is y
        this.board = Array(10)
            .fill(null)
            .map(() => Array(10).fill(null));
        // Keep track of placed ships
        this.ships = [];
        this.missedShots = [];
    }

    receiveAttack(x, y) {
        const target = this.board[x][y];
        // If miss
        if (target === null) this.missedShots.push([x, y]);
        // If hit
        if (target) {
            target.hit();
        }
    }

    /**
     *
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {String} ship Type of ship
     * @param {String} direction horizontal or verical direction of the ship
     */
    placeShip(x, y, ship, direction) {
        const shipLength = shipTypes[ship];
        if (!this.#canPlaceShips(x, y, shipLength, direction)) {
            throw new Error("Can't place ship here");
        }

        const newShip = new Ship(ship);
        this.ships.push(newShip);

        for (let i = 0; i < shipLength; i++) {
            const xCell = direction === "horizontal" ? x + i : x;
            const yCell = direction === "vertical" ? y + i : y;
            this.board[xCell][yCell] = newShip;
        }
    }

    /**
     * Return true if a ship is able to be placed at a given coordinate, false otherwise.
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} length length of the ship
     * @param {String} direction horizontal or verical direction of the ship
     */
    #canPlaceShips(x, y, length, direction) {
        // The max length/height of the board
        const maxGridRowCol = 10;

        // Loop through each cell that the ship will occupy
        for (let i = 0; i < length; i++) {
            const xCell = direction === "horizontal" ? x + i : x;
            const yCell = direction === "vertical" ? y + i : y;

            // If the current cell is outside of the board or is taken
            if (
                xCell >= maxGridRowCol ||
                yCell >= maxGridRowCol ||
                this.board[xCell][yCell] !== null
            )
                return false;
        }

        return true;
    }
}
