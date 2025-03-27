import { JsonFileFetcher } from "./file_fetcher.js";
import { HangmanGame } from "./hangman_game.js";
import { GameDomUpdater } from "./dom_update.js";

let game = null;
let domUpdater = null;

function loadGame(data) {
    const index = Math.floor(Math.random() * data.length);
    game = new HangmanGame(data[index].word, data[index].hint);
    domUpdater = new GameDomUpdater(game);
}

function newGame() {
    domUpdater.stopAnimationFrame();
    jsonFetcher.loadJsonData(loadGame);
}

const FILE_PATH = "file/game_data.json"
const jsonFetcher = new JsonFileFetcher(FILE_PATH)
jsonFetcher.loadJsonData(loadGame)

const newGameButtonDOMElement = document.getElementById("new-game-btn");
const retryGameButtonDOMElement = document.getElementById("retry-game-button");
newGameButtonDOMElement.addEventListener('click', newGame)
retryGameButtonDOMElement.addEventListener('click', newGame)