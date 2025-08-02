export function renderBoard(containerID) {
    const board = document.getElementById(containerID);
    board.innerHTML = ""; //Clear the board

    // Create the cells
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const cell = document.createElement("div");
            cell.dataset.x = x;
            cell.dataset.y = y;

            cell.addEventListener("click", () => {
                console.log(`Clicked ${x}, ${y}`);
                // Attack logic here
            });

            cell.addEventListener("mouseenter", () => {
                cell.style.backgroundColor = "lightgreen";
            });
            
            cell.addEventListener("mouseleave", () => {
                cell.style.backgroundColor = "";
            });

            board.appendChild(cell);
        }
    }
}
