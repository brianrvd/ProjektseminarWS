"use strict"

const Element = require('./element')

module.exports = class FallingWords extends Element {

    constructor(x, y) {
        super()
        this.x = x
        this.y = y
        this.speed = 0.2  // Geschwindigkeit
    }

    draw(ctx) {
        
    ctx.font = "16px Arial"
    ctx.fillStyle = "red"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Test", this.x, this.y) 

    }

    action(playerX, playerY) {
        // Berechne Richtungsvektor zum Player
        const dx = playerX - this.x
        const dy = playerY - this.y
        
        // Normalisiere den Vektor (Länge = 1)
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance > 0) {
            // Bewege in Richtung Player
            this.x += (dx / distance) * this.speed
            this.y += (dy / distance) * this.speed
        }
    }
} 