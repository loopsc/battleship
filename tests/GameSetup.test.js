import { GameSetup } from "../src/modules/GameSetup";
import { Gameboard } from "../src/modules/objects/Gameboard";

describe("Game Setup functions", () => {
    test("Initial state", () => {
        expect(GameSetup.selectedShip).toBe("carrier");
        expect(GameSetup.selectedOrientation).toBe("horizontal");
        expect(GameSetup.currentPlayer).toBe("human");
        expect(GameSetup.playerBoard).toBeInstanceOf(Gameboard);
    });

    test("selectShip function", () => {
        GameSetup.selectShip("DESTROYER");
        expect(GameSetup.selectedShip).toBe("destroyer");
        expect(() => GameSetup.selectShip(123)).toThrow();
        expect(() => GameSetup.selectShip(null)).toThrow();
        expect(() => GameSetup.selectShip(undefined)).toThrow();
        expect(() => GameSetup.selectShip("")).toThrow();

    });

    test("Function returns an array of coordinates", () => {
        GameSetup.selectShip("carrier");
        const arr = GameSetup.getHoverCells(0, 0);

        expect(arr).toBeInstanceOf(Array);
        expect(arr[0]).toEqual([0, 0]);
    });
});
