import { Player } from "../src/modules/objects/Player";
import { Gameboard } from "../src/modules/objects/Gameboard";

describe("Test Player class module", () => {
    test("Create a valid player", () => {
        const player = new Player("human");

        expect(player).toBeInstanceOf(Player);
        expect(player.type).toBe("human");
        expect(player.gameboard).toBeInstanceOf(Gameboard);
    });

    test("Create invalid player", () => {
        expect(() => {
            const player = new Player("alien");
        }).toThrow("Invalid player type");
    });

    test("Method returns true if player is computer", () => {
        const computer = new Player("computer");
        const notComputer = new Player("human");
        expect(computer.isComputer()).toBe(true);
        expect(notComputer.isComputer()).toBe(false);
    });
});
