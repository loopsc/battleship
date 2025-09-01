import { shipLengths } from "../core/constants";
import { Gameboard } from "../core/Gameboard";

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
    botName: "Beep Boop",
    selectedShip: "",
    selectedOrientation: "",
};
