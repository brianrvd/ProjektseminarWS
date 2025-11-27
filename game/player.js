"use strict"

const Element = require('./element')

module.exports = class Player extends Element {

    constructor(x, y) {
        super()
        this.x = x
        this.y = y
    }

    draw(ctx){
        const width = 40
        const height = 20
        
        const topX = this.x
        const topY = this.y -height 

        const bottomLeftX = this.x - width / 2
        const bottomLeftY = this.y
        
         
        const bottomRightX = this.x + width / 2
        const bottomRightY = this.y

        
        ctx.beginPath()
        ctx.moveTo(topX, topY)           // Start an der Spitze
        ctx.lineTo(bottomLeftX, bottomLeftY)   // Linie nach unten links
        ctx.lineTo(bottomRightX, bottomRightY) // Linie nach unten rechts
        ctx.closePath()                  // Zurück zur Spitze
        
        ctx.fillStyle = "black"
        ctx.fill()
    }
    action(){

    }

}

