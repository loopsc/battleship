import { shipLengths } from "../constants";

export class Ship {
    #hits;
    #hitMap;

    constructor(ship, orientation) {
        if (!shipLengths.hasOwnProperty(ship)) {
            throw new Error("Invalid ship type");
        }
        this.length = shipLengths[ship];
        this.type = ship;
        this.orientation = orientation;
        this.#hits = 0;
        this.id = crypto.randomUUID();
        this.#hitMap = Array(this.length).fill(false);
    }

    get hits() {
        return this.#hits;
    }

    hit(index) {
        if (this.#hitMap[index]) {
            // already hit this segment
            return false;
        }
        this.#hitMap[index] = true;
        this.#hits++;
        return true;
    }

    // Return the boolean at a given index of the hitmap
    isHit(index) {
        return this.#hitMap[index]
    }

    isSunk() {
        return this.#hits >= this.length;
    }
}
