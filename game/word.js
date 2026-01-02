"use strict"

const Element = require('./element')
const EnglishGermanDictionary = require('./dictionary')
const InputField = require('./inputfield')

module.exports = class Word extends Element {
    constructor(game, x, y, circleId, speed) {
        super()
        this.destroyed = false 
        this.game = game
        this.circleId = circleId
        this.speed = speed
        
        let dictionary = new EnglishGermanDictionary();
        if(InputField.Inputlist.length != 0) {
            dictionary.setWords(InputField.Inputlist);
            game.gameMode = "ownWords";
        }

        const randomIndex = Math.floor(Math.random() * dictionary.words.length);
        let englishWord = dictionary.words[randomIndex];
        
        if (game.gameMode === 'german') {
            this.displayWord = dictionary.translate(englishWord);
            this.word = englishWord;
        } else {
            this.displayWord = englishWord;
            this.word = englishWord;
        }
        
        while (game.isWordOnDisplay(this.word)) {
            const newIndex = Math.floor(Math.random() * dictionary.words.length);
            englishWord = dictionary.words[newIndex];
            
            if (game.gameMode === 'german') {
                this.displayWord = dictionary.translate(englishWord);
                this.word = englishWord;
            } else {
                this.displayWord = englishWord;
                this.word = englishWord;
            }
        }
        
        this.x = x - document.getElementById("mycanvas").getContext('2d').measureText(this.displayWord).width / 2 //this.displayWord.length*8/2
        this.y = y + 30
    }

    draw(ctx) {
        let currentInput = document.getElementById("current-input")
        if(currentInput.textContent.at(0) == this.displayWord.at(0)) {
            let currentInputLength = currentInput.textContent.length
            const firstPart = this.displayWord.slice(0, currentInputLength);
            const restPart  = this.displayWord.slice(currentInputLength);
            const typedTextWidth = ctx.measureText(firstPart).width;

            ctx.fillStyle = "grey";
            ctx.fillText(firstPart, this.x, this.y);
            
            ctx.fillStyle = "white"
            ctx.fillText(restPart, this.x + typedTextWidth, this.y);
        } else {
            ctx.fillStyle = "white"
            ctx.fillText(this.displayWord, this.x, this.y);
        }
    }

    action() {
        //this.x += Math.random() * 2 - 1
        this.y += this.speed
            if (this.y > window.innerHeight - 80) this.destroyed = true
    }

    checkCollision() {
        if (this.game.elementList.get(this.circleId) == null) { //if it is null, that means the circle has collided
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId);
    }

}
