import { translateCoords, getHoverCells } from "../src/utils/utils";

describe("Utility methods", () => {
    test("Coordinates are translated from numbers to letters and numbers system", () => {
        const battleShipCoords1 = translateCoords(9, 9);
        const battleShipCoords2 = translateCoords(3, 5);
        const battleShipCoords3 = translateCoords(7, 1);

        expect(battleShipCoords1).toBe("J10");
        expect(battleShipCoords2).toBe("D6");
        expect(battleShipCoords3).toBe("H2");
    });

    test("Get the correct cells to be highlighted", () => {
        const highlightOne = getHoverCells(0, 0, "carrier", "horizontal");
        expect(highlightOne).toEqual([
            [0, 0],
            [1, 0],
            [2, 0],
            [3, 0],
            [4, 0],
        ]);

        const highlightTwo = getHoverCells(4, 7, "destroyer", "vertical");
        expect(highlightTwo).toEqual([
            [4, 7],
            [4, 8],
        ]);
    });
});
