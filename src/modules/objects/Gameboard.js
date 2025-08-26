import { Ship } from "./Ship";
import { shipLengths } from "../constants";

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

    isAllShipsSunk() {
        if (this.ships.length === 0) return true;
        return false;
    }

    receiveAttack(x, y) {
        if (x < 0 || x > 9 || y < 0 || y > 9) {
            throw new Error("Provide x and y coordinates");
        }

        const target = this.board[x][y];
        // If miss
        if (!target) {
            this.missedShots.push([x, y]);
            return;
        }

        // If hit
        const { ship, index } = target;

        // Register a hit
        const wasNewHit = ship.hit(index);
        if (!wasNewHit) {
            return;
        }

        // If sunk, remove ship from ships array
        if (ship.isSunk()) {
            this.ships = this.ships.filter((s) => s !== ship);
            console.log(`${ship.type} has been sunk!`);
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
        if (!Object.hasOwn(shipLengths, ship)) {
            throw new Error("Invalid ship type");
        }
        if (direction !== "horizontal" && direction !== "vertical") {
            throw new Error("Invalid direction");
        }

        const shipLength = shipLengths[ship];
        if (!this.canPlaceShips(x, y, ship, direction)) {
            throw new Error("Can't place ship here");
        }

        const existing = this.ships.find((s) => s.type === ship);
        if (existing) throw new Error("This ship is already on the board");

        const newShip = new Ship(ship, direction);
        this.ships.push(newShip);

        for (let i = 0; i < shipLength; i++) {
            const xCell = direction === "horizontal" ? x + i : x;
            const yCell = direction === "vertical" ? y + i : y;
            this.board[xCell][yCell] = { ship: newShip, index: i };
        }
    }

    /**
     * Return true if a ship is able to be placed at a given coordinate, false otherwise.
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} length length of the ship
     * @param {String} direction horizontal or verical direction of the ship
     */
    canPlaceShips(x, y, ship, direction) {
        const length = shipLengths[ship];
        if (direction !== "horizontal" && direction !== "vertical")
            throw new Error("Orientation must be vertical or horizontal");

        if (!Object.hasOwn(shipLengths, ship)) {
            throw new Error("Invalid ship type");
        }

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

    randomize() {
        const shipsToPlace = Object.keys(shipLengths);

        for (const ship of shipsToPlace) {
            let placed = false;

            while (!placed) {
                const direction =
                    Math.random() < 0.5 ? "horizontal" : "vertical";
                const x = Math.floor(Math.random() * 10);
                const y = Math.floor(Math.random() * 10);

                if (this.canPlaceShips(x, y, ship, direction)) {
                    this.placeShip(x, y, ship, direction);
                    placed = true;
                }
            }
        }
    }

    allShipsPlaced() {
        return this.ships.length === 5;
    }

    getHead(x, y, orientation) {
        if (!orientation) {
            console.log(orientation);
            throw new Error("Provide a valid ship and orientation");
        }

        const ship = this.board[x][y];
        if (!ship) throw new Error("No ship at given coordinates");

        if (orientation === "vertical") {
            while (
                y > 0 &&
                this.board[x][y - 1] &&
                this.board[x][y - 1].id === ship.id
            ) {
                y--;
            }
        } else {
            while (
                x > 0 &&
                this.board[x - 1][y] &&
                this.board[x - 1][y].id === ship.id
            ) {
                x--;
            }
        }
        return [x, y];
    }
}
