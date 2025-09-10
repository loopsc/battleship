import { Ship } from "../src/core/Ship";
import { Gameboard } from "../src/core/Gameboard";

describe("Gameboard functions", () => {
    let board;

    beforeEach(() => {
        board = new Gameboard();
    });

    test("isAllShipsSunk method", () => {
        expect(() => {
            board.isAllShipsSunk().toBe(true);
        });

        board.placeShip(0, 0, "submarine", "horizontal");
        expect(() => {
            board.isAllShipsSunk().toBe(false);
        });
    });

    test("receiveAttack method", () => {
        board.placeShip(0, 0, "destroyer", "horizontal");
        expect(() => {
            board.receiveAttack(0, 0).toBe("hit");
            board.receiveAttack(9, 9).toBe("miss");
            board.receiveAttack(0, 0).toBe("already-attacked");
            board.receiveAttack(0, 1).toBe("sunk");
        });
    });

    test("Place invalid ship and orientation", () => {
        expect(() => {
            board
                .placeShip(0, 0, "submarine", "hrizontal")
                .toThrow("Invalid direction");
        });

        expect(() => {
            board
                .placeShip(0, 0, "dolphin", "vertical")
                .toThrow("Invalid ship type");
        });
    });

    test("Ship is hit", () => {
        board.placeShip(2, 2, "submarine", "horizontal");
        board.receiveAttack(2, 2);

        const cell = board.board[2][2];
        expect(cell.ship.hits).toBe(1);
    });

    test("Attack on ship is missed", () => {
        board.placeShip(2, 2, "submarine", "horizontal");
        board.receiveAttack(5, 2);

        const cell = board.board[2][2];
        expect(cell.ship.hits).toBe(0);
    });

    test("Ship orientation and length is accurate", () => {
        // Ship should occupy the given coordinates: [0,0],[1,0],[2,0],[3,0],[4,0]
        board.placeShip(0, 0, "carrier", "horizontal");
        expect(board.board[0][0].ship).toBeInstanceOf(Ship);
        expect(board.board[1][0].ship).toBeInstanceOf(Ship);
        expect(board.board[2][0].ship).toBeInstanceOf(Ship);
        expect(board.board[3][0].ship).toBeInstanceOf(Ship);
        expect(board.board[4][0].ship).toBeInstanceOf(Ship);
    });

    test("Ship is placed out of bounds horizontally and vertically", () => {
        expect(() => {
            board.placeShip(9, 0, "cruiser", "horizontal");
        }).toThrow("Can't place ship here");

        expect(() => {
            board.placeShip(5, 8, "battleship", "vertical");
        }).toThrow("Can't place ship here");
    });

    test("Test placing a single ship and sinking it and checking if board is empty", () => {
        board.placeShip(0, 0, "destroyer", "vertical");
        expect(board.ships.length).toBe(1);
        const cell = board.board[0][0];

        board.receiveAttack(0, 0);
        expect(cell.ship.hits).toBe(1);

        board.receiveAttack(0, 1);
        expect(cell.ship.hits).toBe(2);

        expect(board.ships.length).toBe(0);
    });

    test("Function returns true if a ship has valid placement", () => {
        expect(board.canPlaceShips(0, 0, "carrier", "horizontal")).toBe(true);
        expect(board.canPlaceShips(9, 0, "carrier", "horizontal")).toBe(false);
        expect(() => {
            board.canPlaceShips(9, 0, 5, "horizntal");
        }).toThrow("Orientation must be vertical or horizontal");
        expect(() => {
            board.canPlaceShips(0, 0, 5, "horizontal");
        }).toThrow("Invalid ship type");
    });

    test("randomize() method should place all 5 ships down", () => {
        board.randomize();
        expect(board.ships.length).toBe(5);
    });

    test("allShipsPlaced() should return true if all ships are on the board, false otherwise", () => {
        expect(board.allShipsPlaced()).toBe(false);

        board.randomize();
        expect(board.allShipsPlaced()).toBe(true);
    });

    test("getHead() should return the 'head' of the ship. Touching ships should not count as a single ship", () => {
        board.placeShip(0, 0, "carrier", "horizontal");
        board.placeShip(2, 1, "cruiser", "vertical");

        expect(board.getHead(2, 3, "vertical")).toEqual([2, 1]);
        expect(board.getHead(4, 0, "horizontal")).toEqual([0, 0]);
    });
});
