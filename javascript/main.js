import { JsonFileFetcher } from "./file_fetcher.js";
import { HangmanGame } from "./hangman_game.js";
import { GameDomUpdater } from "./dom_update.js";

let game = null;
let gameResultAnimation;

function loadGame(data) {

    data.forEach(element => {
        console.log("The element is ", element)
    });
    const index = Math.floor(Math.random() * data.length);
    console.log("Creating game for ", data[index].word, data[index].hint);
    game = new HangmanGame(data[index].word, data[index].hint);
    const domUpdater = new GameDomUpdater(game, gameResultAnimation);
    console.log(domUpdater)
}

const FILE_PATH = "file/game_data.json"
const jsonFetcher = new JsonFileFetcher(FILE_PATH)
jsonFetcher.loadJsonData(loadGame)

const newGameButtonDOMElement = document.getElementById("new-game-btn");
newGameButtonDOMElement.addEventListener('click', function() {
    console.log("GAME RESULT IS ", gameResultAnimation)
    cancelAnimationFrame(gameResultAnimation);
    jsonFetcher.loadJsonData(loadGame);
})