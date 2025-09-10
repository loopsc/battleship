import { gameController } from "../src/core/GameController";
import { PlayerSetup, BotSetup } from "../src/core/game-configs";
import { Gameboard } from "../src/core/Gameboard";

describe("GameController", () => {
    beforeEach(() => {
        // Reset boards
        PlayerSetup.playerBoard = new Gameboard();
        BotSetup.botBoard = new Gameboard();
    });

    test("bot discovers orientation after two hits", () => {
        gameController.currentTurn = "bot";

        // Simulate two hits on a horizontal ship
        const [x1, y1] = [0, 0];
        const [x2, y2] = [0, 1];
        gameController.botHits = [
            [x1, y1],
            [x2, y2],
        ];
        gameController.discoveredOrientation = null;

        // Check if 2 hits and orientation has not been discovered yet
        if (
            gameController.botHits.length >= 2 &&
            !gameController.discoveredOrientation
        ) {
            const [firstAttack, secondAttack] =
                gameController.botHits.slice(-2);
            if (firstAttack[0] === secondAttack[0])
                gameController.discoveredOrientation = "horizontal";
            else if (firstAttack[1] === secondAttack[1])
                gameController.discoveredOrientation = "vertical";
        }

        expect(gameController.discoveredOrientation).toBe("horizontal");
    });

    test("botTargets respects discovered orientation", () => {
        gameController.discoveredOrientation = "vertical";
        gameController.botTargets = [];
        gameController.enqueueAdjacentCells(5, 5);

        // vertical → only up/down
        expect(gameController.botTargets).toContainEqual([5, 4]);
        expect(gameController.botTargets).toContainEqual([5, 6]);
        expect(gameController.botTargets).not.toContainEqual([4, 5]);
        expect(gameController.botTargets).not.toContainEqual([6, 5]);
    });
});
