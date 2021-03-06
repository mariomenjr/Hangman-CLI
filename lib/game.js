const Word = require("./word");
const Inquirer = require("inquirer");

const Game = function(_words) {
  this.maxGuesses = 10;
  this.guesses = this.maxGuesses;
  this.indexCurrentWord = 0;
  this.title = `Welcome to Hangman-CLI! Let's play!`;
  this.prompt = Inquirer.createPromptModule();

  this._words = [];

  this._setupGame(_words);
};

Game.prototype.next = function(_next) {
  let finish = !_next;
  if (_next) {
    this.indexCurrentWord++;

    finish = this.indexCurrentWord === this._words.length;
    if (!finish) {
      this.title = `Let's play!`;
      this.guesses = this.maxGuesses;
      this.play();
    } else {
      console.log("You completed them all. Great!");
    }
  }

  if (finish) console.log("\x1b[96mThanks for playing up to here!\x1b[39m\n");
};

Game.prototype.play = function() {
  const currentWord = this._words[this.indexCurrentWord];
  if (currentWord.checkStatus()) {
    this.title = "\x1b[93mThere you go! You made it!\x1b[39m";
    this.prompt([
      {
        type: "confirm",
        name: "next",
        message: this._roundMessage("Next word?")
      }
    ])
      .then(answers => {
        console.log("\n");
        this.next(answers.next);
      })
      .catch(err => {
        throw err;
      });
  } else {
    this.prompt([
      {
        type: "input",
        name: "letterChoosen",
        message: this._roundMessage("Letter")
      }
    ])
      .then(answers => {
        console.log("\n");
        if (currentWord.guess(answers.letterChoosen)) {
          this.title = "\x1b[32mWell played!\x1b[39m How did you know?";
        } else {
          this.guesses--;
          this.title = `\x1b[91mBad choice\x1b[39m, only ${this.guesses} guess(es) left.`;
        }
        this.play();
      })
      .catch(err => {
        throw err;
      });
  }
};

Game.prototype._roundMessage = function(_custom) {
  return `${this.title}\n\n${this._words[this.indexCurrentWord].toString()}\n\n${_custom}:`;
};

Game.prototype._setupGame = function(_words) {
  _words.forEach(_word => {
    this._words.push(new Word(_word));
  });
};

module.exports = Game;
