import "./styles.css";
import { GameController } from "../core/GameController";
import { startGame } from "./startGame";

const gameController = new GameController();
startGame(gameController);
