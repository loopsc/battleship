import { Gameboard } from "../src/modules/objects/Gameboard";
import { PlayerSetup,BotSetup, getHoverCells } from "../src/modules/GameSetup";

describe("Game Setup functions", () => {
    test("Initial state", () => {
        expect(PlayerSetup.selectedShip).toBe("carrier");
        expect(PlayerSetup.selectedOrientation).toBe("horizontal");
        expect(PlayerSetup.playerBoard).toBeInstanceOf(Gameboard);

        expect(BotSetup.botBoard).toBeInstanceOf(Gameboard);
        expect(BotSetup.botName).toBe("Jerome");
        expect(BotSetup.selectedShip).toBe("");
        expect(BotSetup.selectedOrientation).toBe("");

    });

    test("selectShip function", () => {
        PlayerSetup.selectShip("DESTROYER");
        expect(PlayerSetup.selectedShip).toBe("destroyer");
        expect(() => PlayerSetup.selectShip(123)).toThrow();
        expect(() => PlayerSetup.selectShip(null)).toThrow();
        expect(() => PlayerSetup.selectShip(undefined)).toThrow();
        expect(() => PlayerSetup.selectShip("")).toThrow();

    });

    test("Function returns an array of coordinates", () => {
        PlayerSetup.selectShip("carrier");
        const ship = PlayerSetup.selectedShip;
        const orientation = PlayerSetup.selectedOrientation
        const arr = getHoverCells(0, 0, ship, orientation);

        expect(arr).toBeInstanceOf(Array);
        expect(arr[0]).toEqual([0, 0]);
    });
});
