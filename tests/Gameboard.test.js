import { Ship } from "../src/modules/objects/Ship";
import { Gameboard } from "../src/modules/objects/Gameboard";

describe("Gameboard functions", () => {
    let board;

    beforeEach(() => {
        board = new Gameboard();
    });

    test("Place invalid ship orientation", () => {
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

        const ship = board.board[2][2];
        expect(ship.hits).toBe(1);
    });

    test("Ship is missed", () => {
        board.placeShip(2, 2, "submarine", "horizontal");
        board.receiveAttack(5, 2);

        const ship = board.board[2][2];
        expect(ship.hits).toBe(0);

        expect(board.missedShots.length).toBe(1);
    });

    test("Ship orientation and length is accurate", () => {
        // Ship should occupy the given coordinates: [0,0],[1,0],[2,0],[3,0],[4,0]
        board.placeShip(0, 0, "carrier", "horizontal");
        expect(board.board[0][0]).toBeInstanceOf(Ship);
        expect(board.board[1][0]).toBeInstanceOf(Ship);
        expect(board.board[2][0]).toBeInstanceOf(Ship);
        expect(board.board[3][0]).toBeInstanceOf(Ship);
        expect(board.board[4][0]).toBeInstanceOf(Ship);
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
        const ship = board.board[0][0];

        board.receiveAttack(0, 0);
        expect(ship.hits).toBe(1);

        board.receiveAttack(0, 1);
        expect(ship.hits).toBe(2);

        expect(board.ships.length).toBe(0);
    });

    test("Function returns true if a ship has valid placement", () => {
        expect(board.canPlaceShips(0,0,5,"horizontal")).toBe(true);
        expect(board.canPlaceShips(9,0,5,"horizontal")).toBe(false);
        expect(() => {
            board.canPlaceShips(9,0,5,"horizntal")
        }).toThrow("Orientation must be vertical or horizontal");
        expect(() => {
            board.canPlaceShips(0,0,"boat","horizontal")
        }).toThrow("'Length' must be a number");
    })
});
