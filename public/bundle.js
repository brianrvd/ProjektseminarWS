(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./element":2}],2:[function(require,module,exports){
"use strict"

module.exports = class Element {

    action() { }

    draw(ctx) { }

    checkCollision(element) { }
}
},{}],3:[function(require,module,exports){
"use strict"

module.exports = class ElementList extends Array {

    constructor() {
        super()
    }

    add(element) {
        this.push(element)
    }

    get(i) {
        return this[i]
    }

    delete(i) {
        this.splice(i, 1)
    }

    draw(ctx) {
        for (let i = 0; i < this.length; i++) {
            this[i].draw(ctx)
        }
    }

    action() {
        for (let i = 0; i < this.length; i++) {
            this[i].action()
        }
    }

    checkCollision(element) { }
}
},{}],4:[function(require,module,exports){
"use strict"

const RandomWalkCircleElement = require('./randomwalkcircleelement')
const ElementList = require('./elementlist')
const Stage = require('./stage')
const Burst = require('./burst')

//----------------------

module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
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
        ctx.fillStyle = 'rgba(235, 250, 255, 0.05)'        // alpha < 1 löscht den Bildschrim nur teilweise -> bewegte Gegenstände erzeugen Spuren
        ctx.fillRect(0, 0, mycanvas.clientWidth, mycanvas.clientHeight)

        //--- draw elements
        this.elementList.draw(ctx)

        //--- execute element actions
        this.elementList.action()

        this.raf = window.requestAnimationFrame(this.tick.bind(this))
    }
}

},{"./burst":1,"./elementlist":3,"./randomwalkcircleelement":6,"./stage":7}],5:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
},{"./game":4}],6:[function(require,module,exports){
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
},{"./burst":1,"./element":2}],7:[function(require,module,exports){
"use strict"

const Element = require('./element')

module.exports = class Stage extends Element {

    //isDrawn = false

    constructor() {
        super()
        this.x = 0
        this.y = 0
    }

    draw(ctx) {
        var img = new Image();
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
        };
        img.src = 'img/background.png';
    }

    action() {
        
    }
}
},{"./element":2}]},{},[5]);
