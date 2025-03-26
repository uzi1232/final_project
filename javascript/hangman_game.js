export { HangmanGame, GameStatus };

const MAX_ATTEMPTS = 6;
const MIN_WORD_CHAR = 2;
const LETTER_TO_GUESS = "_"

const GameStatus = {
    WON: "won",
    LOST: "lost",
    CONTINUE: "continue",
    INCORRECT: "incorrect",
    CORRECT: "correct"
};

class HangmanGame {
    constructor(expectedWord, wordHint, maxAttempts=MAX_ATTEMPTS) {
        this.expectedWord = expectedWord;
        this.wordHint = wordHint;
        this.maxAttempts = maxAttempts;
        this.#validateWord();

        this.guessCount = 0;
        this.guessedLetters = []
        this.guessedWord = new Array(expectedWord.length).fill(LETTER_TO_GUESS);
        this.gameStatus = GameStatus.CONTINUE;
    }

    #validateWord() {
        if (!this.expectedWord) {
            throw new Error("Expected word cannot be is null or undefined or empty");
        }
        else if (typeof this.expectedWord !== "string") {
            throw new Error("Expected word must be string type");
        }
        else if (this.expectedWord.length < MIN_WORD_CHAR) {
            throw new Error("Expected word must be atleast 2 characters");
        }
    }

    #updateFailAttempt() {
        this.guessCount++;
        if (this.guessCount >= MAX_ATTEMPTS) {
            return GameStatus.LOST;
        }         
        return GameStatus.INCORRECT;
    }
    
    #updateSuccessAttempt(index, key) {
        while(index >= 0) {
            this.guessedWord[index] = key;
            index = this.expectedWord.indexOf(key, index + 1);
        }
        if (this.expectedWord === this.getGuessedWord()) {
            return GameStatus.WON;
        }
        return GameStatus.CORRECT;
    }

    getGuessedWord() {
        return this.guessedWord.join("");
    }

    getGuessedWordArray() {
        return this.guessedWord;
    }

    guess(key) {
        let currentGameStatus = this.gameStatus;

        if (!this.guessedLetters.includes(key) && !this.isGameOver()) {
            this.guessedLetters.push(key);
            let index = this.expectedWord.indexOf(key);
            if (index >= 0) {
                currentGameStatus = this.#updateSuccessAttempt(index, key);
            }
            else {
                currentGameStatus = this.#updateFailAttempt();
            }
            this.gameStatus = currentGameStatus;
        }
        return currentGameStatus;
    }

    isGameOver() {
        return this.gameStatus === GameStatus.WON || this.gameStatus === GameStatus.LOST;
    }

    getGameStatus() {
        return this.gameStatus;
    }

    getGuessCount() {
        return this.guessCount;
    }
}