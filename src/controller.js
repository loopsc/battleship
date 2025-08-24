import { setupScreen } from "./renderSetup";
import { GameSetup } from "./modules/GameSetup";

export function startGame() {
    const { startGameButton, playerNameInput } = setupScreen();
    startGameButton.addEventListener("click", () => {
        // Error checks
        if (!GameSetup.playerBoard.allShipsPlaced()) {
            throw new Error("Place all ships");
        }

        // Set a default name if none given
        GameSetup.playerName = playerNameInput.value || "Player";

        clearScreen();
        console.log(GameSetup.playerName)
    });
}

function clearScreen() {
    document.body.innerHTML = "";
}
