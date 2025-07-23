import { Ship } from "../src/modules/ship";

describe("Creating ships", () => {
    test("Creating the 5 types of ships. Testing types and length", () => {
        const carrier = new Ship("carrier");
        const battleship = new Ship("battleship");
        const cruiser = new Ship("cruiser");
        const submarine = new Ship("submarine");
        const destroyer = new Ship("destroyer");

        expect(carrier.type).toBe("carrier");
        expect(carrier.length).toBe(5);

        expect(battleship.type).toBe("battleship");
        expect(battleship.length).toBe(4);

        expect(cruiser.type).toBe("cruiser");
        expect(cruiser.length).toBe(3);

        expect(submarine.type).toBe("submarine");
        expect(submarine.length).toBe(3);

        expect(destroyer.type).toBe("destroyer");
        expect(destroyer.length).toBe(2);
    });

    test("hit() method increases the number of hits of a specific ship", () => {
        const carrier = new Ship("carrier");
        const sub = new Ship("submarine");

        expect(carrier.hits).toBe(0);
        expect(sub.hits).toBe(0);
        carrier.hit();
        expect(carrier.hits).toBe(1);
        expect(sub.hits).toBe(0);
    });

    test("Ship is sunk", () => {
        const ship = new Ship("destroyer");
        const sub = new Ship("submarine");

        expect(ship.isSunk()).toBe(false);
        for (let i = 0; i < ship.length; i++) {
            ship.hit();
        }
        expect(ship.isSunk()).toBe(true);
        expect(sub.isSunk()).toBe(false);
    });

    test("Create invalid ship", () => {
        expect(() => {
            const ship = new Ship("dolphin");
        }).toThrow("Invalid ship type");
    });
});
