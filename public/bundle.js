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
        img.src = 'img/explosion.png';
        if (img.complete) {
            ctx.drawImage(img, this.x - 10, this.y - 10, 30, 30);
        } else {
            img.onload = () => {
                ctx.drawImage(img, this.x - 10, this.y - 10, 30, 30);
            };
    }
      
        
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
},{"./element":2}],5:[function(require,module,exports){
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

},{"./burst":1,"./elementlist":3,"./fallingwords":4,"./player":7,"./randomwalkcircleelement":8,"./stage":9,"./wordinputhandler":10}],6:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
},{"./game":5}],7:[function(require,module,exports){
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


},{"./element":2}],8:[function(require,module,exports){
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
},{"./burst":1,"./element":2}],9:[function(require,module,exports){
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
        img.src = 'img/background.png';
    
        if (img.complete) {
            ctx.drawImage(img, 0, 0);
   
        }
    }

    action() {
        
    }
}
},{"./element":2}],10:[function(require,module,exports){
'use strict'

module.exports = class WordInputHandler{

    constructor(validator){
        this.input= "";
        this.validator = validator;

        document.addEventListener('keydown', this.handleInput.bind(this));
    }

    handleInput(event){
        if(event.key.length==1 && /[a-zA-Z]/.test(event.key)){
            const letter= event.key.toLowerCase();
            
            if(this.validator.checkLetter(letter)){
                this.input += letter;
                this.notify(letter)

            }else{
                //
            }   
            
        }
    }
    

    notify(letter){
        //hier werden die anderen klassen von dem neuen buchstaben notifiert
        // evtl überflüssig
    }

    getInput(){
        return this.input;
    }

    resetInput(){
        this.input= "";
    }
}
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2J1cnN0LmpzIiwiZ2FtZS9lbGVtZW50LmpzIiwiZ2FtZS9lbGVtZW50bGlzdC5qcyIsImdhbWUvZmFsbGluZ3dvcmRzLmpzIiwiZ2FtZS9nYW1lLmpzIiwiZ2FtZS9tYWluLmpzIiwiZ2FtZS9wbGF5ZXIuanMiLCJnYW1lL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50LmpzIiwiZ2FtZS9zdGFnZS5qcyIsImdhbWUvd29yZGlucHV0aGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQnVyc3QgZXh0ZW5kcyBFbGVtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy5zaXplID0gMTUgICBcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIC8qY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgdGhpcy5zaXplLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSlcclxuICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIlxyXG4gICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICB0aGlzLmFjdGlvbigpXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwidHJhbnNwYXJlbnRcIlxyXG4gICAgICAgIGN0eC5maWxsKCkqL1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcuc3JjID0gJ2ltZy9leHBsb3Npb24ucG5nJztcclxuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB0aGlzLnggLSAxMCwgdGhpcy55IC0gMTAsIDMwLCAzMCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB0aGlzLnggLSAxMCwgdGhpcy55IC0gMTAsIDMwLCAzMCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgICAgICB0aGlzLnNpemUgKz0gMC4xXHJcbiAgICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbGVtZW50IHtcclxuXHJcbiAgICBhY3Rpb24oKSB7IH1cclxuXHJcbiAgICBkcmF3KGN0eCkgeyB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oZWxlbWVudCkgeyB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbGVtZW50TGlzdCBleHRlbmRzIEFycmF5IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICB9XHJcblxyXG4gICAgYWRkKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnB1c2goZWxlbWVudClcclxuICAgIH1cclxuXHJcbiAgICBnZXQoaSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW2ldXHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlKGkpIHtcclxuICAgICAgICB0aGlzLnNwbGljZShpLCAxKVxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXNbaV0uZHJhdyhjdHgpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpc1tpXS5hY3Rpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbihlbGVtZW50KSB7IH1cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRmFsbGluZ1dvcmRzIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoeCwgeSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwLjIgIC8vIEdlc2Nod2luZGlna2VpdFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgXHJcbiAgICBjdHguZm9udCA9IFwiMTZweCBBcmlhbFwiXHJcbiAgICBjdHguZmlsbFN0eWxlID0gXCJyZWRcIlxyXG4gICAgY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCJcclxuICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiXHJcbiAgICBjdHguZmlsbFRleHQoXCJUZXN0XCIsIHRoaXMueCwgdGhpcy55KSBcclxuXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKHBsYXllclgsIHBsYXllclkpIHtcclxuICAgICAgICAvLyBCZXJlY2huZSBSaWNodHVuZ3N2ZWt0b3IgenVtIFBsYXllclxyXG4gICAgICAgIGNvbnN0IGR4ID0gcGxheWVyWCAtIHRoaXMueFxyXG4gICAgICAgIGNvbnN0IGR5ID0gcGxheWVyWSAtIHRoaXMueVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE5vcm1hbGlzaWVyZSBkZW4gVmVrdG9yIChMw6RuZ2UgPSAxKVxyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KVxyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkaXN0YW5jZSA+IDApIHtcclxuICAgICAgICAgICAgLy8gQmV3ZWdlIGluIFJpY2h0dW5nIFBsYXllclxyXG4gICAgICAgICAgICB0aGlzLnggKz0gKGR4IC8gZGlzdGFuY2UpICogdGhpcy5zcGVlZFxyXG4gICAgICAgICAgICB0aGlzLnkgKz0gKGR5IC8gZGlzdGFuY2UpICogdGhpcy5zcGVlZFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSAiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRmFsbGluZ1dvcmRzID0gcmVxdWlyZSgnLi9mYWxsaW5nd29yZHMnKVxyXG5jb25zdCBQbGF5ZXIgPXJlcXVpcmUoJy4vcGxheWVyJylcclxuY29uc3QgRWxlbWVudExpc3QgPSByZXF1aXJlKCcuL2VsZW1lbnRsaXN0JylcclxuY29uc3QgU3RhZ2UgPSByZXF1aXJlKCcuL3N0YWdlJylcclxuY29uc3QgQnVyc3QgPSByZXF1aXJlKCcuL2J1cnN0JylcclxuY29uc3QgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgPSByZXF1aXJlKCcuL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50JylcclxuY29uc3QgV29yZElucHV0SGFuZGxlciA9IHJlcXVpcmUoJy4vd29yZGlucHV0aGFuZGxlcicpXHJcblxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yYWYgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGhhbmRsZVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBudWxsXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPW51bGxcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0ID0gbmV3IEVsZW1lbnRMaXN0KClcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50KCkpO1xyXG4gICAgICAgICAgICB9LCAzMDAwICogaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBTdGFnZSgpKVxyXG5cclxuICAgICAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcclxuICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdCA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIGxldCBteWNhbnZhcyA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Y2FudmFzXCIpXHJcblxyXG4gICAgICAgIGxldCBjdHggPSBteWNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcblxyXG4gICAgICAgIC8vLS0tIGNsZWFyIHNjcmVlblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgyMzUsIDI1MCwgMjU1KScgICAgICAgIC8vIGFscGhhIDwgMSBsw7ZzY2h0IGRlbiBCaWxkc2NocmltIG51ciB0ZWlsd2Vpc2UgLT4gYmV3ZWd0ZSBHZWdlbnN0w6RuZGUgZXJ6ZXVnZW4gU3B1cmVuXHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIG15Y2FudmFzLmNsaWVudFdpZHRoLCBteWNhbnZhcy5jbGllbnRIZWlnaHQpXHJcblxyXG4gICAgICAgIC8vLS0tIGRyYXcgZWxlbWVudHNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmRyYXcoY3R4KVxyXG5cclxuICAgICAgICAvLy0tLSBleGVjdXRlIGVsZW1lbnQgYWN0aW9uc1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWN0aW9uKClcclxuXHJcbiAgICAgICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICAvL1fDtnJ0ZXIgYmV3ZWdlbiBzaWNoIHp1bSBQbGF5ZXJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50TGlzdFtpXVxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgRmFsbGluZ1dvcmRzKSB7XHJcbiAgICAgICAgICAgIC8vIMOcQkVSR0lCIGRpZSBQbGF5ZXItS29vcmRpbmF0ZW4gaGllcjpcclxuICAgICAgICAgICAgZWxlbWVudC5hY3Rpb24odGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFjdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcbiBcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoXCIuL2dhbWVcIilcclxubGV0IG15R2FtZSA9IG5ldyBHYW1lKClcclxubXlHYW1lLnN0YXJ0KCkiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCl7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSA0MFxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IDIwXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdG9wWCA9IHRoaXMueFxyXG4gICAgICAgIGNvbnN0IHRvcFkgPSB0aGlzLnkgLWhlaWdodCBcclxuXHJcbiAgICAgICAgY29uc3QgYm90dG9tTGVmdFggPSB0aGlzLnggLSB3aWR0aCAvIDJcclxuICAgICAgICBjb25zdCBib3R0b21MZWZ0WSA9IHRoaXMueVxyXG4gICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICBjb25zdCBib3R0b21SaWdodFggPSB0aGlzLnggKyB3aWR0aCAvIDJcclxuICAgICAgICBjb25zdCBib3R0b21SaWdodFkgPSB0aGlzLnlcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgY3R4Lm1vdmVUbyh0b3BYLCB0b3BZKSAgICAgICAgICAgLy8gU3RhcnQgYW4gZGVyIFNwaXR6ZVxyXG4gICAgICAgIGN0eC5saW5lVG8oYm90dG9tTGVmdFgsIGJvdHRvbUxlZnRZKSAgIC8vIExpbmllIG5hY2ggdW50ZW4gbGlua3NcclxuICAgICAgICBjdHgubGluZVRvKGJvdHRvbVJpZ2h0WCwgYm90dG9tUmlnaHRZKSAvLyBMaW5pZSBuYWNoIHVudGVuIHJlY2h0c1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKSAgICAgICAgICAgICAgICAgIC8vIFp1csO8Y2sgenVyIFNwaXR6ZVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgICBjdHguZmlsbCgpXHJcbiAgICB9XHJcbiAgICBhY3Rpb24oKXtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50IGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIDU4MCArIDIwXHJcbiAgICAgICAgdGhpcy55ID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMueSA8IDU1MCkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMTUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JleVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMueSA+IDU1MCAmJiB0aGlzLnkgPD0gNTUwICsgMC4zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FsbEJ1cnN0KGN0eClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2FsbEJ1cnN0KGN0eCkge1xyXG4gICAgICAgIHZhciBidXJzdCA9IG5ldyBCdXJzdCh0aGlzLngsIHRoaXMueSlcclxuICAgICAgICBidXJzdC5kcmF3KGN0eClcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDIgLSAxXHJcbiAgICAgICAgaWYodGhpcy55IDwgNTUwKSB7XHJcbiAgICAgICAgICAgIHRoaXMueSArPSAwLjNcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFN0YWdlIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgLy9pc0RyYXduID0gZmFsc2VcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy54ID0gMFxyXG4gICAgICAgIHRoaXMueSA9IDBcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcuc3JjID0gJ2ltZy9iYWNrZ3JvdW5kLnBuZyc7XHJcbiAgICBcclxuICAgICAgICBpZiAoaW1nLmNvbXBsZXRlKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwKTtcclxuICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBXb3JkSW5wdXRIYW5kbGVye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHZhbGlkYXRvcil7XHJcbiAgICAgICAgdGhpcy5pbnB1dD0gXCJcIjtcclxuICAgICAgICB0aGlzLnZhbGlkYXRvciA9IHZhbGlkYXRvcjtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIHRoaXMuaGFuZGxlSW5wdXQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlSW5wdXQoZXZlbnQpe1xyXG4gICAgICAgIGlmKGV2ZW50LmtleS5sZW5ndGg9PTEgJiYgL1thLXpBLVpdLy50ZXN0KGV2ZW50LmtleSkpe1xyXG4gICAgICAgICAgICBjb25zdCBsZXR0ZXI9IGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYodGhpcy52YWxpZGF0b3IuY2hlY2tMZXR0ZXIobGV0dGVyKSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0ICs9IGxldHRlcjtcclxuICAgICAgICAgICAgICAgIHRoaXMubm90aWZ5KGxldHRlcilcclxuXHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuXHJcbiAgICBub3RpZnkobGV0dGVyKXtcclxuICAgICAgICAvL2hpZXIgd2VyZGVuIGRpZSBhbmRlcmVuIGtsYXNzZW4gdm9uIGRlbSBuZXVlbiBidWNoc3RhYmVuIG5vdGlmaWVydFxyXG4gICAgICAgIC8vIGV2dGwgw7xiZXJmbMO8c3NpZ1xyXG4gICAgfVxyXG5cclxuICAgIGdldElucHV0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5wdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRJbnB1dCgpe1xyXG4gICAgICAgIHRoaXMuaW5wdXQ9IFwiXCI7XHJcbiAgICB9XHJcbn0iXX0=
