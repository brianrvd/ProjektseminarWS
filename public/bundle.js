(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict"

module.exports = class Element {

    action() { }

    draw(ctx) { }

    checkCollision(element) { }
}
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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
},{"./element":1}],4:[function(require,module,exports){
"use strict"

const FallingWords = require('./fallingwords')
const Player =require('./player')
const ElementList = require('./elementlist')


//----------------------

module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
        this.player =null
    }

    //----------------------

    start() {
        this.elementList = new ElementList()
        this.player=new Player(250, 600)
        this.elementList.add(this.player)
        for (let i = 0; i < 10; i++) {
            this.elementList.add(new FallingWords(i * 60, 0))
        }
          
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

},{"./elementlist":2,"./fallingwords":3,"./player":6}],5:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
},{"./game":4}],6:[function(require,module,exports){
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


},{"./element":1}]},{},[5])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2VsZW1lbnQuanMiLCJnYW1lL2VsZW1lbnRsaXN0LmpzIiwiZ2FtZS9mYWxsaW5nd29yZHMuanMiLCJnYW1lL2dhbWUuanMiLCJnYW1lL21haW4uanMiLCJnYW1lL3BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsZW1lbnQge1xyXG5cclxuICAgIGFjdGlvbigpIHsgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7IH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbihlbGVtZW50KSB7IH1cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsZW1lbnRMaXN0IGV4dGVuZHMgQXJyYXkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgIH1cclxuXHJcbiAgICBhZGQoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucHVzaChlbGVtZW50KVxyXG4gICAgfVxyXG5cclxuICAgIGdldChpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbaV1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUoaSkge1xyXG4gICAgICAgIHRoaXMuc3BsaWNlKGksIDEpXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpc1tpXS5kcmF3KGN0eClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzW2ldLmFjdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKGVsZW1lbnQpIHsgfVxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBGYWxsaW5nV29yZHMgZXh0ZW5kcyBFbGVtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDAuMiAgLy8gR2VzY2h3aW5kaWdrZWl0XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBcclxuICAgIGN0eC5mb250ID0gXCIxNnB4IEFyaWFsXCJcclxuICAgIGN0eC5maWxsU3R5bGUgPSBcInJlZFwiXHJcbiAgICBjdHgudGV4dEFsaWduID0gXCJjZW50ZXJcIlxyXG4gICAgY3R4LnRleHRCYXNlbGluZSA9IFwibWlkZGxlXCJcclxuICAgIGN0eC5maWxsVGV4dChcIlRlc3RcIiwgdGhpcy54LCB0aGlzLnkpIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24ocGxheWVyWCwgcGxheWVyWSkge1xyXG4gICAgICAgIC8vIEJlcmVjaG5lIFJpY2h0dW5nc3Zla3RvciB6dW0gUGxheWVyXHJcbiAgICAgICAgY29uc3QgZHggPSBwbGF5ZXJYIC0gdGhpcy54XHJcbiAgICAgICAgY29uc3QgZHkgPSBwbGF5ZXJZIC0gdGhpcy55XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gTm9ybWFsaXNpZXJlIGRlbiBWZWt0b3IgKEzDpG5nZSA9IDEpXHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2UgPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpXHJcbiAgICAgICAgXHJcbiAgICAgICAgaWYgKGRpc3RhbmNlID4gMCkge1xyXG4gICAgICAgICAgICAvLyBCZXdlZ2UgaW4gUmljaHR1bmcgUGxheWVyXHJcbiAgICAgICAgICAgIHRoaXMueCArPSAoZHggLyBkaXN0YW5jZSkgKiB0aGlzLnNwZWVkXHJcbiAgICAgICAgICAgIHRoaXMueSArPSAoZHkgLyBkaXN0YW5jZSkgKiB0aGlzLnNwZWVkXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59ICIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBGYWxsaW5nV29yZHMgPSByZXF1aXJlKCcuL2ZhbGxpbmd3b3JkcycpXHJcbmNvbnN0IFBsYXllciA9cmVxdWlyZSgnLi9wbGF5ZXInKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKVxyXG5cclxuXHJcbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHYW1lIHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJhZiAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVxdWVzdCBhbmltYXRpb24gZnJhbWUgaGFuZGxlXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdCA9IG51bGxcclxuICAgICAgICB0aGlzLnBsYXllciA9bnVsbFxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBuZXcgRWxlbWVudExpc3QoKVxyXG4gICAgICAgIHRoaXMucGxheWVyPW5ldyBQbGF5ZXIoMjUwLCA2MDApXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQodGhpcy5wbGF5ZXIpXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBGYWxsaW5nV29yZHMoaSAqIDYwLCAwKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgICBcclxuICAgICAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcclxuICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgc3RvcCgpIHtcclxuICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yYWYpXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdCA9IG51bGxcclxuICAgIH1cclxuXHJcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbiAgICB0aWNrKCkge1xyXG4gICAgICAgIGxldCBteWNhbnZhcyA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm15Y2FudmFzXCIpXHJcblxyXG4gICAgICAgIGxldCBjdHggPSBteWNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcblxyXG4gICAgICAgIC8vLS0tIGNsZWFyIHNjcmVlblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgyMzUsIDI1MCwgMjU1KScgICAgICAgIC8vIGFscGhhIDwgMSBsw7ZzY2h0IGRlbiBCaWxkc2NocmltIG51ciB0ZWlsd2Vpc2UgLT4gYmV3ZWd0ZSBHZWdlbnN0w6RuZGUgZXJ6ZXVnZW4gU3B1cmVuXHJcbiAgICAgICAgY3R4LmZpbGxSZWN0KDAsIDAsIG15Y2FudmFzLmNsaWVudFdpZHRoLCBteWNhbnZhcy5jbGllbnRIZWlnaHQpXHJcblxyXG4gICAgICAgIC8vLS0tIGRyYXcgZWxlbWVudHNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmRyYXcoY3R4KVxyXG5cclxuICAgICAgICAvLy0tLSBleGVjdXRlIGVsZW1lbnQgYWN0aW9uc1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWN0aW9uKClcclxuXHJcbiAgICAgICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxyXG5cclxuICAgICAgICAvL1fDtnJ0ZXIgYmV3ZWdlbiBzaWNoIHp1bSBQbGF5ZXJcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50TGlzdFtpXVxyXG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgRmFsbGluZ1dvcmRzKSB7XHJcbiAgICAgICAgICAgIC8vIMOcQkVSR0lCIGRpZSBQbGF5ZXItS29vcmRpbmF0ZW4gaGllcjpcclxuICAgICAgICAgICAgZWxlbWVudC5hY3Rpb24odGhpcy5wbGF5ZXIueCwgdGhpcy5wbGF5ZXIueSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbGVtZW50LmFjdGlvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcbiBcclxuY29uc3QgR2FtZSA9IHJlcXVpcmUoXCIuL2dhbWVcIilcclxubGV0IG15R2FtZSA9IG5ldyBHYW1lKClcclxubXlHYW1lLnN0YXJ0KCkiLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFBsYXllciBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy54ID0geFxyXG4gICAgICAgIHRoaXMueSA9IHlcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCl7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSA0MFxyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IDIwXHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgdG9wWCA9IHRoaXMueFxyXG4gICAgICAgIGNvbnN0IHRvcFkgPSB0aGlzLnkgLWhlaWdodCBcclxuXHJcbiAgICAgICAgY29uc3QgYm90dG9tTGVmdFggPSB0aGlzLnggLSB3aWR0aCAvIDJcclxuICAgICAgICBjb25zdCBib3R0b21MZWZ0WSA9IHRoaXMueVxyXG4gICAgICAgIFxyXG4gICAgICAgICBcclxuICAgICAgICBjb25zdCBib3R0b21SaWdodFggPSB0aGlzLnggKyB3aWR0aCAvIDJcclxuICAgICAgICBjb25zdCBib3R0b21SaWdodFkgPSB0aGlzLnlcclxuXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgY3R4Lm1vdmVUbyh0b3BYLCB0b3BZKSAgICAgICAgICAgLy8gU3RhcnQgYW4gZGVyIFNwaXR6ZVxyXG4gICAgICAgIGN0eC5saW5lVG8oYm90dG9tTGVmdFgsIGJvdHRvbUxlZnRZKSAgIC8vIExpbmllIG5hY2ggdW50ZW4gbGlua3NcclxuICAgICAgICBjdHgubGluZVRvKGJvdHRvbVJpZ2h0WCwgYm90dG9tUmlnaHRZKSAvLyBMaW5pZSBuYWNoIHVudGVuIHJlY2h0c1xyXG4gICAgICAgIGN0eC5jbG9zZVBhdGgoKSAgICAgICAgICAgICAgICAgIC8vIFp1csO8Y2sgenVyIFNwaXR6ZVxyXG4gICAgICAgIFxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSBcImJsYWNrXCJcclxuICAgICAgICBjdHguZmlsbCgpXHJcbiAgICB9XHJcbiAgICBhY3Rpb24oKXtcclxuXHJcbiAgICB9XHJcblxyXG59XHJcblxyXG4iXX0=
