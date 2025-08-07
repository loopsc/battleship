import { shipTypes } from "../constants";

export class Ship {
    #hits;

    constructor(ship) {
        if (!shipTypes.hasOwnProperty(ship)) {
            throw new Error("Invalid ship type");
        }
        this.length = shipTypes[ship];
        this.type = ship;
        this.#hits = 0;
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
