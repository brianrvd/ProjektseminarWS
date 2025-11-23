"use strict"

const Element = require('./element')
const Burst = require('./burst')
<<<<<<< HEAD

module.exports = class RandomWalkCircleElement extends Element {
    constructor() {
        super()
        this.x = Math.random() * 580 + 20
        this.y = 0
    }

    draw(ctx) {
        if (this.y < 550) {
=======
const Word = require('./word')

module.exports = class RandomWalkCircleElement extends Element {
    constructor(game) {
        super()
        this.game = game
        this.x = Math.random() * 530 + 40
        this.y = 0
        this.speed = 0.7
        setTimeout(() => { 
            let word = new Word(this.game, this.x, this.y, this.instanceId, this.speed)
            this.game.elementList.add(word)
        }, 100);
    }

    draw(ctx) {
>>>>>>> master
            ctx.beginPath()
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fillStyle = "grey"
            ctx.fill()
<<<<<<< HEAD
        }
        if (this.y > 550 && this.y <= 550 + 0.3) {
            this.callBurst(ctx)
        }
    }

    callBurst(ctx) {
        var burst = new Burst(this.x, this.y)
        burst.draw(ctx)
=======
    }

    callBurst() {
        var burst = new Burst(this.x, this.y, this.game)
        this.game.elementList.add(burst)
>>>>>>> master
    }

    action() {
        //this.x += Math.random() * 2 - 1
<<<<<<< HEAD
        if(this.y < 550) {
            this.y += 0.3
        }
=======
        this.y += this.speed
    }

    checkCollision() {
        if (this.y > 550 && this.y <= 550 + this.speed) {
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId);
        this.callBurst()
>>>>>>> master
    }
}