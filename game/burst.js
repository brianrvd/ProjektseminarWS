"use strict"

const Element = require('./element')

module.exports = class Burst extends Element {

    constructor(x, y) {
        super()
        this.x = x
        this.y = y
        this.size = 15   
    }

    draw(ctx) {
        /*ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, true)
        ctx.closePath()
        ctx.fillStyle = "red"
        ctx.fill()
        this.action()
        ctx.fillStyle = "transparent"
        ctx.fill()*/
        var img = new Image();
        img.onload = () => {
            ctx.drawImage(img, this.x - 10, this.y - 10, 30, 30);
        };
        img.src = 'img/explosion.png';
    }

    action() {
        //this.x += Math.random() * 2 - 1
        this.size += 0.1
    }
}