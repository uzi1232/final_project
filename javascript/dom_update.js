export { GameDomUpdater };
import { GameStatus } from "./hangman_game.js";

const IMAGE_PREFIX = "hangman_";
const VALID_KEYS = "abcdefghijklmnopqrstuvwxyz";
class GameDomUpdater {
    constructor(game, gameResultAnimation) {
        this.game = game
        this.wordValueContainerDOM = document.getElementById("word-value-container");
        this.hintValueDOM = document.getElementById("hint-value");
        
        this.gameStatusElementDOM = document.getElementById("game-status");
        this.gameSatusContainerDOM = document.getElementById("game-status-container");
        this.gameStatusDirectionLeft = true;
        this.gameStatusPosition = 0;
        this.gameResultAnimation = gameResultAnimation;
        cancelAnimationFrame(this.gameResultAnimation);
        
        this.initializeGameDom();
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
                // console.log("Value is ", this.game);
                const correctGuess = this.game.guess(event.target.innerText);
                // if (correctGuess) {
                //     this.updateWord();
                // } 
                // console.log("Correct guess is ", correctGuess )
                this.updateGameStatus();
            })
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
        this.gameSatusContainerDOM.classList.add('hide-element');
    }

    updateGameStatus() {
        if (this.game.getGameStatus() === GameStatus.WON) {
            console.log("GAME WON");
            this.updateWord();
            this.gameSatusContainerDOM.classList.remove('hide-element');
            let innerHTML = `GAME WON !!`;
            this.gameStatusElementDOM.innerHTML = innerHTML;
            this.updateHangmanImage(IMAGE_PREFIX + "success");
            this.gameResultAnimation = requestAnimationFrame(this.moveGameStatus);
        } 
        else if (this.game.getGameStatus() === GameStatus.LOST) {
            console.log("GAME LOST")
            this.gameSatusContainerDOM.classList.remove('hide-element');
            let innerHTML = `GAME LOST :(`;
            this.gameStatusElementDOM.innerHTML = innerHTML;
            this.updateHangmanImage(IMAGE_PREFIX + "fail");
            this.gameResultAnimation = requestAnimationFrame(this.moveGameStatus);
        }
        else if (this.game.getGameStatus() === GameStatus.CORRECT) {
            this.updateWord();

        }
        else if (this.game.getGameStatus() === GameStatus.INCORRECT) {
            this.updateHangmanImage(IMAGE_PREFIX + this.game.getGuessCount());
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
        console.log("HAHAH", this.gameStatusDirectionLeft, this.gameStatusPosition)
        this.gameResultAnimation = requestAnimationFrame(this.moveGameStatus);
    }
    
}