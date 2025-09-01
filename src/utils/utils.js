import { shipLengths } from "../core/constants";

export function clearScreen() {
    const main = document.getElementById("main");
    main.innerHTML = "";
}

/**
 * Convert numeric coordinates to Battleship-style coordinates
 * @param {number} x - 0–9 column index
 * @param {number} y - 0–9 row index
 * @returns {string} Example: "A1", "D5", "J10"
 */
export function translateCoords(x, y) {
    if (x < 0 || x > 9 || y < 0 || y > 9) {
        throw new Error("Coordinates must be between 0 and 9");
    }
    const letter = String.fromCharCode(65 + x);
    const number = y + 1;
    return `${letter}${number}`;
}

/**
 *
 * @param {Number} startX X coordinate of the cell user has hovered
 * @param {Number} startY Y coordinate of the cell user has hovered
 * @returns Array of the cells that the ship should occupy
 */
export function getHoverCells(startX, startY, ship, orientation) {
    if (!orientation || !ship) {
        throw new Error("Provide a valid ship and orientation");
    }

    const shipLength = shipLengths[ship];

    const cellsArr = [];

    for (let i = 0; i < shipLength; i++) {
        const x = orientation === "horizontal" ? startX + i : startX;
        const y = orientation === "vertical" ? startY + i : startY;

        cellsArr.push([x, y]);
    }
    return cellsArr;
}