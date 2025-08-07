export const GameManager = {
    selectedShip: null,
    currentPlayer: "human",
    selectShip(ship) {
        this.selectedShip = ship;
    }
}