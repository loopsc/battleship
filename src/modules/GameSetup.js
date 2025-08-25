import { shipLengths } from "./constants";
import { Gameboard } from "./objects/Gameboard";

// Properties primarily used for setting up the player board
export const PlayerSetup = {
    selectedShip: "carrier",
    selectedOrientation: "horizontal",
    // currentPlayer: "human",
    playerBoard: new Gameboard(),
    playerName: "",

    selectShip(ship) {
        if (typeof ship !== "string")
            throw new Error("Ship name must be a string");
        if (!(ship.toLowerCase() in shipLengths))
            throw new Error("Invalid ship type");
        this.selectedShip = ship.toLowerCase();
    },

    /**
     *
     * @param {Number} startX X coordinate of the cell user has hovered
     * @param {Number} startY Y coordinate of the cell user has hovered
     * @returns Array of the cells that the ship should occupy
     */
    getHoverCells(startX, startY) {
        const length = shipLengths[this.selectedShip];
        const cellsArr = [];

        for (let i = 0; i < length; i++) {
            const x =
                this.selectedOrientation === "horizontal" ? startX + i : startX;
            const y =
                this.selectedOrientation === "vertical" ? startY + i : startY;

            cellsArr.push([x, y]);
        }
        return cellsArr;
    },
};


export const BotSetup = {
    botBoard: new Gameboard()
}
