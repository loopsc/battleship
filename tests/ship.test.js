import { Ship, shipTypes } from "../ship";
import { Gameboard } from "../Gameboard";

describe("Gameboard functions", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test("Places a battleship horizontally at (0,0)", () => {
    board.placeShip(0, 0, "battleship", "horizontal");

    const ref = board.board[0][0];
    expect(ref).toBeInstanceOf(Ship);
    expect(board.board[1][0]).toBe(ref);
    expect(board.board[3][0]).toBe(ref);
  });

  test("Ship is hit", () => {
    board.placeShip(2, 2, "submarine", "horizontal");
    board.receiveAttack(2, 2);

    const ship = board.board[2][2];
    expect(ship.hits).toBe(1);
  });

  test("Testing length of ship is accurate and hit is missed", () => {
    board.placeShip(2, 2, "submarine", "horizontal");
    board.receiveAttack(5, 2);

    const ship = board.board[2][2];
    expect(ship.hits).toBe(0);
  });
});
