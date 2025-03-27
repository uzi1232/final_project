export { GameDomUpdater };
import { GameStatus } from "./hangman_game.js";

const IMAGE_PREFIX = "hangman_";
const VALID_KEYS = "abcdefghijklmnopqrstuvwxyz";
const ANIMATION_TIMEOUT = 50;
class GameDomUpdater {
    constructor(game) {
        this.game = game
        this.wordValueContainerDOM = document.getElementById("word-value-container");
        this.hintValueDOM = document.getElementById("hint-value");
        
        this.gameStatusElementDOM = document.getElementById("game-status");
        this.gameSatusParentContainerDOM = document.getElementById("game-status-parent-container");
        
        this.gameStatusDirectionLeft = true;
        this.gameStatusPosition = 0;
        this.gameResultAnimation = undefined;
        this.gameResultTimeHandler = undefined;
        cancelAnimationFrame(this.gameResultAnimation);
        
        this.initializeGameDom();
    }

    stopAnimationFrame() {
        cancelAnimationFrame(this.gameResultAnimation);
        clearTimeout(this.gameResultTimeHandler)
    }

    initializeGameDom() {
        this.initializeKeyboardDom();
        this.addEventsKeyboard();
        this.updateWord();
        this.updateHint();
        this.updateHangmanImage(IMAGE_PREFIX + this.game.getGuessCount());

        this.initialGameStatus();
    }

    initializeKeyboardDom() {
        const keyboardElementDOM = document.getElementById("keyboard-container");
        let keyboardHTML = "";
        for (const c of VALID_KEYS) {
            keyboardHTML += `<div><button id="${c}-btn">${c}</button></div>`
        }
        keyboardElementDOM.innerHTML = keyboardHTML;
    }

    addEventsKeyboard() {
        for (const c of VALID_KEYS) {
            const keyDOM = document.getElementById(`${c}-btn`);
            keyDOM.addEventListener("click", event => {
                console.log("Value is ", event.target.innerText);
                this.game.guess(event.target.innerText);
                this.updateGameStatus(event.target.innerText);
            })
        }
    }

    disableKeyboardKey(key) {
        const keyDOM = document.getElementById(`${key}-btn`);
        keyDOM.classList.add("disable-button-style");
        keyDOM.disabled = true;
    }

    disableAllKeyboardKey() {
        for (const key of VALID_KEYS) {
            const keyDOM = document.getElementById(`${key}-btn`);
            keyDOM.classList.add("disable-button-style");
            keyDOM.disabled = true;
        }
    }

    updateWord() {
        let innerHtml = "";
        const words = this.game.getGuessedWordArray();
        console.log(words)
        words.forEach(element => {
            innerHtml += `<div>${element}</div>`
        });
        this.wordValueContainerDOM.innerHTML = innerHtml;
    }

    updateHint() {
        this.hintValueDOM.innerHTML = `${this.game.wordHint}`
    }

    updateHangmanImage(file) {
        const hangmanImgElementDOM = document.getElementById("hangman-img");
        hangmanImgElementDOM.innerHTML = `<img src="./images/${file}.png" alt="state of hangman game">`;
    }

    initialGameStatus() {
        this.gameSatusParentContainerDOM.classList.add('hide-element');
    }

    updateGameStatus(key) {
        if (this.game.getGameStatus() === GameStatus.WON) {
            console.log("GAME WON");
            this.updateWord();
            this.gameSatusParentContainerDOM.classList.remove('hide-element');
            let innerHTML = `YOU WON THE GAME!!`;
            this.gameStatusElementDOM.innerHTML = innerHTML;
            this.updateHangmanImage(IMAGE_PREFIX + "success");
            this.gameResultAnimation = requestAnimationFrame(this.moveGameStatus);
            this.disableAllKeyboardKey();
        } 
        else if (this.game.getGameStatus() === GameStatus.LOST) {
            console.log("GAME LOST")
            this.gameSatusParentContainerDOM.classList.remove('hide-element');
            let innerHTML = `YOU LOST. Answer: ${this.game.expectedWord}`;
            this.gameStatusElementDOM.innerHTML = innerHTML;
            this.updateHangmanImage(IMAGE_PREFIX + "fail");
            this.gameResultAnimation = requestAnimationFrame(this.moveGameStatus);
            this.disableAllKeyboardKey();
        }
        else if (this.game.getGameStatus() === GameStatus.CORRECT) {
            this.updateWord();
            this.disableKeyboardKey(key);
        }
        else if (this.game.getGameStatus() === GameStatus.INCORRECT) {
            this.updateHangmanImage(IMAGE_PREFIX + this.game.getGuessCount());
            this.disableKeyboardKey(key);
        }        
    }

    moveGameStatus = () => {
        if(this.gameStatusDirectionLeft === true){
            this.gameStatusPosition++
            if(this.gameStatusPosition === 100){
                this.gameStatusDirectionLeft = false;
            }
        }else{
            this.gameStatusPosition--
            if(this.gameStatusPosition === 0){
                this.gameStatusDirectionLeft = true;
            }
        }
        this.gameStatusElementDOM.style.left = `${this.gameStatusPosition}%`;

        this.gameResultTimeHandler = setTimeout(() => {
            this.gameResultAnimation = requestAnimationFrame(this.moveGameStatus);
        }, ANIMATION_TIMEOUT);

    }
    
}