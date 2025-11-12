"use strict"

const Element = require('./element')
const Burst = require('./burst')

module.exports = class RandomWalkCircleElement extends Element {
    constructor() {
        super()
        this.x = Math.random() * 580 + 20
        this.y = 0
    }

    draw(ctx) {
        if (this.y < 550) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fillStyle = "grey"
            ctx.fill()
        }
        if (this.y > 550 && this.y <= 550 + 0.3) {
            this.callBurst(ctx)
        }
    }

    callBurst(ctx) {
        var burst = new Burst(this.x, this.y)
        burst.draw(ctx)
    }

    action() {
        //this.x += Math.random() * 2 - 1
        if(this.y < 550) {
            this.y += 0.3
        }
    }
}