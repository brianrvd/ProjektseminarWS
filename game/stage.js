"use strict"

const Element = require('./element')

module.exports = class Stage extends Element {

    constructor() {
        super()
        this.background = new Image()
        this.loaded = false

        this.background.onload = () => {
            this.loaded = true
        }

        this.background.src = 'img/neueHintergrund.png'
    }

    draw(ctx) {
        if (!this.loaded) return
        const canvas = ctx.canvas
        ctx.drawImage(this.background,0,0,canvas.width,canvas.height)
    }
}
