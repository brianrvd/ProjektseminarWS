"use strict"

const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')
const Stage = require('./stage')
const Burst = require('./burst')
const Word = require("./word")

//----------------------

module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
    }

    //----------------------

    start() {
        this.elementList = new ElementList()
        this.elementList.add(new Stage());
        for (let i = 0; i < 60; i++) {
            setTimeout(() => { 
                this.elementList.add(new RandomWalkCircleElement(this));
            }, 3000 * i);
        }

        this.timeOfLastFrame = Date.now()
        this.raf = window.requestAnimationFrame(this.tick.bind(this))
    }

    //----------------------

    stop() {
        window.cancelAnimationFrame(this.raf)
        this.elementList = null
    }

    //----------------------

    tick() {
        let mycanvas = window.document.getElementById("mycanvas")
        let ctx = mycanvas.getContext('2d')
        ctx.font = "18px Arial";

        //--- clear screen
        ctx.fillStyle = 'rgba(235, 250, 255, 0.1)' // alpha < 1 löscht den Bildschrim nur teilweise -> bewegte Gegenstände erzeugen Spuren
        ctx.fillRect(0, 0, mycanvas.clientWidth, mycanvas.clientHeight)

        //--- draw elements
        this.elementList.draw(ctx)

        //--- execute element actions
        this.elementList.action()

        //--- check element collisions
        this.elementList.checkCollision()

        this.raf = window.requestAnimationFrame(this.tick.bind(this))
    }

    isWordOnDisplay(word) {
        for (let i = 0; i < this.elementList.length; i++) {
            if(this.elementList[i] != null && this.elementList[i] instanceof Word && this.elementList[i].word.charAt(0) == word.charAt(0) ) {
                return true
            }
        }
        return false
    }
}
