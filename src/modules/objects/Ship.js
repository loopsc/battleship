import { shipLengths } from "../constants";

export class Ship {
    #hits;

    constructor(ship, orientation) {
        if (!shipLengths.hasOwnProperty(ship)) {
            throw new Error("Invalid ship type");
        }
        this.length = shipLengths[ship];
        this.type = ship;
        this.orientation = orientation;
        this.#hits = 0;
        this.id = crypto.randomUUID()
    }

    get hits() {
        return this.#hits;
    }

    hit() {
        this.#hits += 1;
    }

    isSunk() {
        if (this.#hits === this.length) return true;
        return false;
    }
}
