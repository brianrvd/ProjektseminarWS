"use strict"

const Bullet = require('./bullet')
const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')
const Stage = require('./stage')
const Burst = require('./burst')
const Word = require("./word")
const Health = require("./health")

//----------------------

module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
        this.health = new Health();

        this.score = 0 
        this.currentInput = ''
    }

    //----------------------

    start() {
        this.elementList = new ElementList()
        this.setupInput()
        this.elementList.add(new Stage());  
        this.elementList.add(this.health);
    
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
    // menü nach tod einblinden 
    gameOver() {
    this.stop();
    document.getElementById("mycanvas").style.display = "none";      // Canvas verstecken
    document.getElementById("main-menu").style.display = "flex";    // Menü zeigen 
    this.health = new Health();                                    // leben wieder zurück setzen 

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
        // Spieler tod ? 
        if (this.health.isDead()) {
                this.gameOver();
             return;
            }


        this.updateUI()

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
    

    setupInput() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.shootToCircle()
            else if (e.key === 'Backspace') this.currentInput = this.currentInput.slice(0, -1)
            else if (/[a-zA-Z]/.test(e.key)) this.currentInput += e.key.toLowerCase()
            this.updateUI()
        })
    }

    shootToCircle() {
        if (!this.currentInput) return
    
        // Finde das WORT in der elementList
        const targetWord = this.elementList.find(el => 
            el instanceof Word && !el.hasCollided && el.word === this.getCurrentWord()
        )
    
            if (!targetWord) return
    
        // Die Bullet fliegt zum CIRCLE-ELEMENT (nicht zum Wort)
        // targetWord.circleId ist die instanceId des Kreises
        this.elementList.add(new Bullet(
            targetWord.x,           // ZIEL X des Kreises
            targetWord.y,           // ZIEL Y des Kreises
            targetWord.circleId,    // Target ist der KREIS
            this
        ))
        this.currentInput = ''
    }

    getCurrentWord() {
        return this.currentInput
    }

    updateUI() {
        const el = id => document.getElementById(id)
        if (el('current-input')) el('current-input').textContent = this.getCurrentWord()
        if (el('score')) el('score').textContent = this.score
    }

}
