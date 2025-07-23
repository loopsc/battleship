import { Gameboard } from "./gameboard";
class Player {
    constructor(type) {
        if (type !== "human" && type !== "computer") {
            throw new Error("Invalid player type");
        }
        this.type = type;
        this.gameboard = new Gameboard();
    }

    isComputer() {
        return type === "computer";
    }

    attack(opponentBoard, x, y) {
        opponentBoard.receiveAttack(x, y)
    }
}
