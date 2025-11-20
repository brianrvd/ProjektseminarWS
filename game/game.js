"use strict"

const FallingWords = require('./fallingwords')
const Player =require('./player')
const ElementList = require('./elementlist')
const Stage = require('./stage')
const Burst = require('./burst')
const RandomWalkCircleElement = require('./randomwalkcircleelement')
const WordInputHandler = require('./wordinputhandler')



module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
        this.player =null
    }

    //----------------------

    start() {
        this.elementList = new ElementList()
        for (let i = 0; i < 60; i++) {
            setTimeout(() => { 
                this.elementList.add(new RandomWalkCircleElement());
            }, 3000 * i);
        }
        this.elementList.add(new Stage())

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

        //--- clear screen
        ctx.fillStyle = 'rgba(235, 250, 255)'        // alpha < 1 löscht den Bildschrim nur teilweise -> bewegte Gegenstände erzeugen Spuren
        ctx.fillRect(0, 0, mycanvas.clientWidth, mycanvas.clientHeight)

        //--- draw elements
        this.elementList.draw(ctx)

        //--- execute element actions
        this.elementList.action()

        this.raf = window.requestAnimationFrame(this.tick.bind(this))

        //Wörter bewegen sich zum Player
        for (let i = 0; i < this.elementList.length; i++) {
        const element = this.elementList[i]
        if (element instanceof FallingWords) {
            // ÜBERGIB die Player-Koordinaten hier:
            element.action(this.player.x, this.player.y)
        } else {
            element.action()
        }
    }
    }
}
