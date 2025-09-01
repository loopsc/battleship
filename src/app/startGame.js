import { setupScreen } from "../ui/renderSetup";
import { renderGame } from "../ui/renderGame";
import { PlayerSetup } from "../core/game-configs";
import { clearScreen } from "../utils/utils";

export function startGame() {
    const { startGameButton, playerNameInput } = setupScreen();
    startGameButton.addEventListener("click", () => {
        // Error check
        if (!PlayerSetup.playerBoard.allShipsPlaced()) {
            throw new Error("Place all ships");
        }

        // Set a default name if none given
        PlayerSetup.playerName = playerNameInput.value || "Player";

        clearScreen();
        renderGame();
    });
}
