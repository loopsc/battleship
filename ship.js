export const shipTypes = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
};

export class Ship {
    #hits;
    #sunk;

    constructor(ship) {
        if (!shipTypes.hasOwnProperty(ship)) {
            throw new Error("Invalid ship type")
        }
        this.length = shipTypes[ship];
        this.type = ship;
        this.#hits = 0;
        this.#sunk = false;
    }

    get hits() {
        return this.#hits
    }

    hit() {
        this.#hits += 1;
    }

    isSunk() {
        if (this.#hits === this.length) return true;
        return false;
    }
}
