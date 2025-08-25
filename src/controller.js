import { setupScreen } from "./renderSetup";
import { renderGame } from "./renderGame";
import { PlayerSetup } from "./modules/GameSetup";

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

function clearScreen() {
    const main = document.getElementById("main");
    main.innerHTML = "";
}
