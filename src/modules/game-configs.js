import { shipLengths } from "./constants";
import { Gameboard } from "./objects/Gameboard";

// Properties primarily used for setting up the player board
export const PlayerSetup = {
    selectedShip: "carrier",
    selectedOrientation: "horizontal",
    playerBoard: new Gameboard(),
    playerName: "",

    selectShip(ship) {
        if (typeof ship !== "string")
            throw new Error("Ship name must be a string");
        if (!(ship.toLowerCase() in shipLengths))
            throw new Error("Invalid ship type");
        this.selectedShip = ship.toLowerCase();
    },
};

export const BotSetup = {
    botBoard: new Gameboard(),
    botName: "Jerome",
    selectedShip: "",
    selectedOrientation: ""
};

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
