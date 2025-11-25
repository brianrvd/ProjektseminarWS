(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Element = require('./element')

module.exports = class Bullet extends Element {
    constructor(targetX, targetY, targetId, game) {
        super()
        // Startposition: Fest, wie du willst
        this.x = 270
        this.y = 520
        
        this.targetX = targetX
        this.targetY = targetY
        this.targetId = targetId  // instanceId des ZIEL-Kreises
        this.game = game
        this.hasCollided = false
        
        // Richtungsvektor
        const dx = targetX - this.x
        const dy = targetY - this.y
        const dist = Math.hypot(dx, dy) || 1
        this.vx = (dx / dist) * 8
        this.vy = (dy / dist) * 8
    }

    draw(ctx) {
        if (this.hasCollided) return
        ctx.fillStyle = '#ff0'
        ctx.beginPath()
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2)
        ctx.fill()
        
        ctx.shadowBlur = 10
        ctx.shadowColor = '#ff0'
        ctx.fill()
        ctx.shadowBlur = 0
    }

    action() {
        if (this.hasCollided) return
        
        // Ziel-Kreis-Position aktualisieren (er bewegt sich!)
        const target = this.game.elementList.get(this.targetId)
        if (target) {
            this.targetX = target.x
            this.targetY = target.y
            
            const dx = this.targetX - this.x
            const dy = this.targetY - this.y
            const dist = Math.hypot(dx, dy) || 1
            this.vx = (dx / dist) * 8
            this.vy = (dy / dist) * 8
        }
        
        this.x += this.vx
        this.y += this.vy
    }

    checkCollision() {
        if (this.game.elementList.get(this.targetId) == null) {
            this.onCollision()
        }
        const dist = Math.hypot(this.targetX - this.x, this.targetY - this.y)
        if (dist < 15) {
            this.onCollision()
        }
        if (this.x < 0 || this.x > window.innerWidth || 
            this.y < 0 || this.y > window.innerHeight) {
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
    }
}

},{"./element":3}],2:[function(require,module,exports){
"use strict"

const Element = require('./element')
const ElementList = require('./elementlist')
const Game = require('./game')

module.exports = class Burst extends Element {

    constructor(x, y, game) {
        super()
        this.game = game
        this.x = x
        this.y = y
        this.size = 15   
        this.checkCollision()
    }

    draw(ctx) {
        var img = new Image();
        img.onload = () => {
            ctx.drawImage(img, this.x - 10, this.y - 10, 30, 30);
        };
        img.src = 'img/explosion.png';
    }

    action() {
        //this.x += Math.random() * 2 - 1
    }
    
    checkCollision() { 
        if(this.instanceId != -1) {
        setTimeout(() => {
            this.onCollision()
        }, 700);  
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId)
    }
}
},{"./element":3,"./elementlist":4,"./game":5}],3:[function(require,module,exports){
"use strict"

module.exports = class Element {

    hasCollided = false

    constructor() {
        this.instanceId = -1
    }

    action() { }

    draw(ctx) { }

    checkCollision() { }

    onCollision() { }

    setId(id) {
        this.instanceId = id
    }
}
},{}],4:[function(require,module,exports){
"use strict"

module.exports = class ElementList extends Array {

    constructor() {
        super()
    }

    add(element) {
        this.push(element)
        element.setId(this.length - 1) 
    }

    get(i) {
        return this[i]
    }

    delete(i) {
        //this.splice(i, 1)
        this[i] = null
    }

    draw(ctx) {
        for (let i = 0; i < this.length; i++) {
            if(this[i] != null) {
                this[i].draw(ctx)
            }
        }
    }

    
    action() {
        for (let i = this.length - 1; i >= 0; i--) {    
            if(this[i] != null) {
                this[i].action()
                // NEU: Bullet und Word cleanup
                if (this[i].hasCollided || this[i].destroyed) {
                    this.splice(i, 1)
                }
            }
        }
    }

    checkCollision() { 
        for (let i = 0; i < this.length; i++) {
            if(this[i] != null && !this[i].hasCollided) {
                this[i].checkCollision()
            }
        }
    }
}

},{}],5:[function(require,module,exports){
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

},{"./bullet":1,"./burst":2,"./elementlist":4,"./health":6,"./randomwalkcircleelement":8,"./stage":9,"./word":10}],6:[function(require,module,exports){
"use strict"

const Element = require('./element')
//const randomwalkcircleelement = require('./randomwalkcircleelement')

module.exports = class Health extends Element {

    constructor() {  
        super()            
        this.health = 3;
        this.heart = new Image();
        this.heart.src = 'img/heart.png';

        this.loaded = false; 
        this.heart.onload = () => {                    //ladet das bild heart
            this.loaded = true;
        };
    }
    

    draw(ctx){
        if (!this.loaded) return;                          //wenn das bild geladen ist sollte es die herzen zeichnen
        
        if (this.health >= 1) {
            ctx.drawImage(this.heart, 10,10,25,25);
        }
        if (this.health >= 2) {
            ctx.drawImage(this.heart, 40,10,25,25);
        }
        if (this.health >= 3) {
            ctx.drawImage(this.heart, 70,10,25,25);
        }
    }



    reduce(){
       this.health--;
    }
    isDead() {
    return this.health <= 0;
}

    /*
      
    update() {                                                  // Überprüft den frame ob hasCollided = true 
        if (this.randomwalkcircleelement.hasCollided) {         
            this.health--;
            this.randomWalkCircleElement.hasCollided = false;  // setzt collided auf false so dass nur eine herz pro collision abgezogen wird 
        }
    }
         */ 
}
},{"./element":3}],7:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
// beim tasten druck canvas zeigen und menü verstecken 
const startButton = document.getElementById("start-button"); 
startButton.onclick = () => {
    document.getElementById("main-menu").style.display = "none"; // versteckt das main menü 
    document.getElementById("mycanvas").style.display = "flex"; // zeigt canvas wieder auf
    myGame.start();
};

},{"./game":5}],8:[function(require,module,exports){
"use strict"

const Element = require('./element')
const Burst = require('./burst')
const Word = require('./word')
const Health = require('./health')

module.exports = class RandomWalkCircleElement extends Element {
    constructor(game) {
        super()
        this.game = game
        this.x = Math.random() * 530 + 40
        this.y = 0
        this.speed = 0.7                    //orginal speed = 0.7; ich verändere es zum testen 
        setTimeout(() => { 
            let word = new Word(this.game, this.x, this.y, this.instanceId, this.speed)
            this.game.elementList.add(word)
        }, 100);
    }

    draw(ctx) {
            ctx.beginPath()
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.fillStyle = "grey"
            ctx.fill()
    }

    callBurst() {
        var burst = new Burst(this.x, this.y, this.game)
        this.game.elementList.add(burst)
    }

    action() {
        //this.x += Math.random() * 2 - 1
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
        this.game.health.reduce();             
    }
}
},{"./burst":2,"./element":3,"./health":6,"./word":10}],9:[function(require,module,exports){
"use strict"

const Element = require('./element')

module.exports = class Stage extends Element {

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
},{"./element":3}],10:[function(require,module,exports){
"use strict"

const Element = require('./element')

module.exports = class Word extends Element {
    constructor(game, x, y, circleId, speed) {
        super()
        this.destroyed = false 
        this.game = game
        this.circleId = circleId
        this.speed = speed
        const wordList = ['Rock','Paper','Scissor','Apple','Orange','Banana','Grape','Mango','Lemon','Lime','Cherry','Pear','Peach','Plum','Apricot','Fig','Date','Kiwi','Melon','Berry','Straw','Stone','Water','Fire','Earth','Wind','Sky','Cloud','Rain','Storm','Thunder','Lightning','River','Ocean','Sea','Lake','Pond','Stream','Hill','Mountain','Valley','Forest','Woods','Jungle','Desert','Island','Coast','Shore','Beach','Sand','Dirt','Soil','Grass','Leaf','Tree','Branch','Root','Flower','Petal','Seed','Plant','Herb','Vine','Bark','Stem','Moss','Fungi','Mushroom','Animal','Bird','Fish','Insect','Beast','Creature','Human','Person','Child','Adult','Man','Woman','Boy','Girl','Friend','Neighbor','Doctor','Teacher','Student','Pilot','Driver','Farmer','Hunter','Singer','Dancer','Artist','Writer','Reader','Leader','Worker','Builder','Maker','Cook','Baker','Soldier','Officer','Guard','King','Queen','Prince','Princess','Knight','Wizard','Hero','Giant','Dwarf','Robot','Alien','Monster','Angel','Demon','Spirit','Ghost','Shadow','Light','Dark','Bright','Dim','Sharp','Blunt','Soft','Hard','Strong','Weak','Quick','Slow','Fast','Heavy','Lightweight','Small','Large','Huge','Tiny','Short','Tall','Wide','Narrow','Deep','Shallow','New','Old','Young','Ancient','Fresh','Stale','Hot','Cold','Warm','Cool','Dry','Wet','Clean','Dirty','Sweet','Sour','Bitter','Salty','Spicy','Plain','Happy','Sad','Angry','Calm','Brave','Shy','Polite','Rude','Kind','Mean','Smart','Dull','Clever','Wise','Silly','Funny','Serious','Ready','Basic','Simple','Complex','Difficult','Easy','Possible','Certain','Random','Common','Rare','Famous','Unknown','Empty','Full','Open','Closed','Early','Late','First','Last','Right','Left','North','South','East','West','Inside','Outside','Above','Below','Front','Back','Near','Far','Here','There','Everywhere','Somewhere','Nowhere','Always','Never','Sometimes','Often','Seldom','Daily','Weekly','Monthly','Yearly','Moment','Second','Minute','Hour','Day','Week','Month','Year','Decade','Century','Time','Clock','Watch','Morning','Noon','Evening','Night','Midnight','Sun','Moon','Star','Planet','World','Universe','Galaxy','Space','Void','Energy','Power','Force','Motion','Speed','Gravity','Atom','Cell','Matter','Object','Item','Thing','Tool','Device','Machine','Engine','Motor','Car','Truck','Bus','Train','Plane','Boat','Ship','Bike','Cycle','Wheel','Road','Path','Trail','Bridge','Tunnel','Tower','House','Home','Room','Door','Window','Wall','Floor','Ceiling','Roof','Hall','Garden','Yard','Farm','Barn','Market','Store','Shop','Mall','Library','School','Office','Factory','Church','Temple','Castle','Palace','Village','Town','City','Country','Nation','Kingdom','Empire','Army','Navy','Police','Court','Law','Judge','Crime','Jury','Trial','Money','Cash','Coin','Credit','Debit','Bank','Value','Price','Cost','Trade','Sale','Store','Buyer','Seller','Gift','Present','Prize','Reward','Treasure','Gold','Silver','Copper','Iron','Steel','Stone','Brick','Wood','Paper','Cloth','Leather','Glass','Plastic','Rubber','String','Rope','Chain','Blade','Sword','Knife','Axe','Hammer','Wrench','Screw','Nail','Bolt','Drill','Saw','Brush','Paint','Color','Ink','Pen','Pencil','Marker','Book','Page','Story','Poem','Song','Music','Sound','Noise','Voice','Word','Letter','Phrase','Sentence','Line','Paragraph','Novel','Drama','Comedy','Tragedy','Movie','Film','Scene','Actor','Stage','Screen','Image','Picture','Photo','Video','Camera','Light','Lamp','Candle','Fireplace','Oven','Stove','Fridge','Table','Chair','Desk','Bed','Couch','Sofa','Shelf','Cabinet','Mirror','Clock','Bag','Box','Bottle','Cup','Glass','Plate','Bowl','Fork','Spoon','Knife','Meal','Food','Drink','Bread','Rice','Meat','Fish','Egg','Milk','Cheese','Butter','Sugar','Salt','Pepper','Spice','Soup','Stew','Sauce','Fruit','Vegetable','Carrot','Potato','Tomato','Onion','Garlic','Pepper','Corn','Bean','Pea','Spinach','Broccoli','Cabbage','Lettuce','Tea','Coffee','Juice','Water','Soda','Wine','Beer','Breakfast','Lunch','Dinner','Snack','Feast','Party','Game','Sport','Match','Win','Loss','Score','Goal','Point','Team','Player','Coach','Judge','Referee','Race','Run','Walk','Jump','Swim','Climb','Throw','Catch','Hit','Kick','Push','Pull','Lift','Drop','Hold','Touch','Look','See','Hear','Listen','Speak','Talk','Say','Tell','Write','Read','Think','Know','Learn','Teach','Understand','Believe','Imagine','Remember','Forget','Love','Hate','Fear','Hope','Dream','Sleep','Wake','Live','Die','Grow','Shrink','Change','Stay','Move','Travel','Visit','Explore','Search','Find','Lose','Build','Break','Fix','Create','Destroy','Open','Close','Start','Stop','Begin','End','Continue','Return','Follow','Lead','Support','Help','Save','Protect','Attack','Defend','Join','Leave','Enter','Exit','Cloth','Shirt','Pants','Dress','Skirt','Coat','Hat','Boot','Shoe','Sock','Glove','Belt','Ring','Necklace','Bracelet','Watch','Wallet','Purse','Phone','Tablet','Laptop','Computer','Keyboard','Mouse','Screen','Monitor','Cable','Wire','Signal','Network','Website','Internet','Software','Program','File','Folder','Data','Code','Error','System','Logic','Method','Theory','Model','Pattern','Structure','Shape','Form','Circle','Square','Triangle','Cube','Sphere','Line','Point','Angle','Curve','Edge','Side','Center','Level','Status','Option','Choice','Chance','Risk','Plan','Idea','Goal','Dream','Wish','Order','Rule','Guide','Map','List','Chart','Graph','Table','Test','Exam','Quiz','Lesson','Class','Course','Skill','Talent','Art','Science','Math','History','Geography','Physics','Chemistry','Biology','Economy','Market','Trade','Business','Company','Office','Worker','Manager','Leader','Boss','Owner','Partner','Client','Customer','Service','Product','Brand','Model','Version','Market','Industry','Technology','Design','Style','Quality','Feature','Function','Purpose','Effect','Cause','Result','Victory','Failure','Success','Effort','Focus','Honor','Glory','Truth','Faith','Trust','Peace','War','Battle','Fight','Weapon','Shield','Armor','Flag','Symbol','Sign','Message','Notice','News','Report','Paper','Article','Letter','Email','Text','Chat','Call','Signal','Alert','Warning','Danger','Safety','Health','Body','Heart','Mind','Brain','Hand','Foot','Eye','Ear','Mouth','Nose','Face','Hair','Skin','Bone','Blood','Breath','Life','Death','Birth','Childhood','Youth','Adult','Elder','Future','Past','Present']
        this.word = wordList[Math.floor(Math.random()*wordList.length)]
        while (game.isWordOnDisplay(this.word)) {
            this.word = wordList[Math.floor(Math.random()*wordList.length)]
        }
        this.x = x - this.word.length*8/2
        this.y = y + 30
    }

    draw(ctx) {
        ctx.fillStyle = "white"
        ctx.fillText(this.word, this.x, this.y);
    }

    action() {
        //this.x += Math.random() * 2 - 1
        this.y += this.speed
            if (this.y > window.innerHeight - 80) this.destroyed = true
    }

    checkCollision() {
        if (this.game.elementList.get(this.circleId) == null) { //if it is null, that means the circle has collided
            this.onCollision()
        }
    }

    onCollision() {
        this.hasCollided = true
        this.game.elementList.delete(this.instanceId);
    }
}

},{"./element":3}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2J1bGxldC5qcyIsImdhbWUvYnVyc3QuanMiLCJnYW1lL2VsZW1lbnQuanMiLCJnYW1lL2VsZW1lbnRsaXN0LmpzIiwiZ2FtZS9nYW1lLmpzIiwiZ2FtZS9oZWFsdGguanMiLCJnYW1lL21haW4uanMiLCJnYW1lL3JhbmRvbXdhbGtjaXJjbGVlbGVtZW50LmpzIiwiZ2FtZS9zdGFnZS5qcyIsImdhbWUvd29yZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCdWxsZXQgZXh0ZW5kcyBFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKHRhcmdldFgsIHRhcmdldFksIHRhcmdldElkLCBnYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIC8vIFN0YXJ0cG9zaXRpb246IEZlc3QsIHdpZSBkdSB3aWxsc3RcclxuICAgICAgICB0aGlzLnggPSAyNzBcclxuICAgICAgICB0aGlzLnkgPSA1MjBcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnRhcmdldFggPSB0YXJnZXRYXHJcbiAgICAgICAgdGhpcy50YXJnZXRZID0gdGFyZ2V0WVxyXG4gICAgICAgIHRoaXMudGFyZ2V0SWQgPSB0YXJnZXRJZCAgLy8gaW5zdGFuY2VJZCBkZXMgWklFTC1LcmVpc2VzXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSBmYWxzZVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFJpY2h0dW5nc3Zla3RvclxyXG4gICAgICAgIGNvbnN0IGR4ID0gdGFyZ2V0WCAtIHRoaXMueFxyXG4gICAgICAgIGNvbnN0IGR5ID0gdGFyZ2V0WSAtIHRoaXMueVxyXG4gICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmh5cG90KGR4LCBkeSkgfHwgMVxyXG4gICAgICAgIHRoaXMudnggPSAoZHggLyBkaXN0KSAqIDhcclxuICAgICAgICB0aGlzLnZ5ID0gKGR5IC8gZGlzdCkgKiA4XHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb2xsaWRlZCkgcmV0dXJuXHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9ICcjZmYwJ1xyXG4gICAgICAgIGN0eC5iZWdpblBhdGgoKVxyXG4gICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIDUsIDAsIE1hdGguUEkgKiAyKVxyXG4gICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICBcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDEwXHJcbiAgICAgICAgY3R4LnNoYWRvd0NvbG9yID0gJyNmZjAnXHJcbiAgICAgICAgY3R4LmZpbGwoKVxyXG4gICAgICAgIGN0eC5zaGFkb3dCbHVyID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNDb2xsaWRlZCkgcmV0dXJuXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gWmllbC1LcmVpcy1Qb3NpdGlvbiBha3R1YWxpc2llcmVuIChlciBiZXdlZ3Qgc2ljaCEpXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKVxyXG4gICAgICAgIGlmICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRYID0gdGFyZ2V0LnhcclxuICAgICAgICAgICAgdGhpcy50YXJnZXRZID0gdGFyZ2V0LnlcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGR4ID0gdGhpcy50YXJnZXRYIC0gdGhpcy54XHJcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gdGhpcy50YXJnZXRZIC0gdGhpcy55XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmh5cG90KGR4LCBkeSkgfHwgMVxyXG4gICAgICAgICAgICB0aGlzLnZ4ID0gKGR4IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgICAgIHRoaXMudnkgPSAoZHkgLyBkaXN0KSAqIDhcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy54ICs9IHRoaXMudnhcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy52eVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZWxlbWVudExpc3QuZ2V0KHRoaXMudGFyZ2V0SWQpID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGRpc3QgPSBNYXRoLmh5cG90KHRoaXMudGFyZ2V0WCAtIHRoaXMueCwgdGhpcy50YXJnZXRZIC0gdGhpcy55KVxyXG4gICAgICAgIGlmIChkaXN0IDwgMTUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnggPCAwIHx8IHRoaXMueCA+IHdpbmRvdy5pbm5lcldpZHRoIHx8IFxyXG4gICAgICAgICAgICB0aGlzLnkgPCAwIHx8IHRoaXMueSA+IHdpbmRvdy5pbm5lckhlaWdodCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcbmNvbnN0IEVsZW1lbnRMaXN0ID0gcmVxdWlyZSgnLi9lbGVtZW50bGlzdCcpXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL2dhbWUnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBCdXJzdCBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHgsIHksIGdhbWUpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMueCA9IHhcclxuICAgICAgICB0aGlzLnkgPSB5XHJcbiAgICAgICAgdGhpcy5zaXplID0gMTUgICBcclxuICAgICAgICB0aGlzLmNoZWNrQ29sbGlzaW9uKClcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIHZhciBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgdGhpcy54IC0gMTAsIHRoaXMueSAtIDEwLCAzMCwgMzApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW1nLnNyYyA9ICdpbWcvZXhwbG9zaW9uLnBuZyc7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy54ICs9IE1hdGgucmFuZG9tKCkgKiAyIC0gMVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHsgXHJcbiAgICAgICAgaWYodGhpcy5pbnN0YW5jZUlkICE9IC0xKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH0sIDcwMCk7ICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZClcclxuICAgIH1cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsZW1lbnQge1xyXG5cclxuICAgIGhhc0NvbGxpZGVkID0gZmFsc2VcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlSWQgPSAtMVxyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHsgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7IH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHsgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkgeyB9XHJcblxyXG4gICAgc2V0SWQoaWQpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlSWQgPSBpZFxyXG4gICAgfVxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRWxlbWVudExpc3QgZXh0ZW5kcyBBcnJheSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZChlbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5wdXNoKGVsZW1lbnQpXHJcbiAgICAgICAgZWxlbWVudC5zZXRJZCh0aGlzLmxlbmd0aCAtIDEpIFxyXG4gICAgfVxyXG5cclxuICAgIGdldChpKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXNbaV1cclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUoaSkge1xyXG4gICAgICAgIC8vdGhpcy5zcGxpY2UoaSwgMSlcclxuICAgICAgICB0aGlzW2ldID0gbnVsbFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKHRoaXNbaV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tpXS5kcmF3KGN0eClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBcclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgeyAgICBcclxuICAgICAgICAgICAgaWYodGhpc1tpXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2ldLmFjdGlvbigpXHJcbiAgICAgICAgICAgICAgICAvLyBORVU6IEJ1bGxldCB1bmQgV29yZCBjbGVhbnVwXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpc1tpXS5oYXNDb2xsaWRlZCB8fCB0aGlzW2ldLmRlc3Ryb3llZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7IFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzW2ldICE9IG51bGwgJiYgIXRoaXNbaV0uaGFzQ29sbGlkZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbaV0uY2hlY2tDb2xsaXNpb24oKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBCdWxsZXQgPSByZXF1aXJlKCcuL2J1bGxldCcpXHJcbmNvbnN0IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50ID0gcmVxdWlyZSgnLi9yYW5kb213YWxrY2lyY2xlZWxlbWVudCcpXHJcbmNvbnN0IEVsZW1lbnRMaXN0ID0gcmVxdWlyZSgnLi9lbGVtZW50bGlzdCcpXHJcbmNvbnN0IFN0YWdlID0gcmVxdWlyZSgnLi9zdGFnZScpXHJcbmNvbnN0IEJ1cnN0ID0gcmVxdWlyZSgnLi9idXJzdCcpXHJcbmNvbnN0IFdvcmQgPSByZXF1aXJlKFwiLi93b3JkXCIpXHJcbmNvbnN0IEhlYWx0aCA9IHJlcXVpcmUoXCIuL2hlYWx0aFwiKVxyXG5cclxuLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEdhbWUge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMucmFmICAgICAgICAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IGFuaW1hdGlvbiBmcmFtZSBoYW5kbGVcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0ID0gbnVsbFxyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gbmV3IEhlYWx0aCgpO1xyXG5cclxuICAgICAgICB0aGlzLnNjb3JlID0gMCBcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdCA9IG5ldyBFbGVtZW50TGlzdCgpXHJcbiAgICAgICAgdGhpcy5zZXR1cElucHV0KClcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3RhZ2UoKSk7ICBcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZCh0aGlzLmhlYWx0aCk7XHJcbiAgICBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50KHRoaXMpKTtcclxuICAgICAgICAgICAgfSwgMzAwMCAqIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnRpbWVPZkxhc3RGcmFtZSA9IERhdGUubm93KClcclxuICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXHJcbiAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBudWxsXHJcbiAgICAgICBcclxuICAgIH1cclxuICAgIC8vIG1lbsO8IG5hY2ggdG9kIGVpbmJsaW5kZW4gXHJcbiAgICBnYW1lT3ZlcigpIHtcclxuICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteWNhbnZhc1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7ICAgICAgLy8gQ2FudmFzIHZlcnN0ZWNrZW5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjsgICAgLy8gTWVuw7wgemVpZ2VuIFxyXG4gICAgdGhpcy5oZWFsdGggPSBuZXcgSGVhbHRoKCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGViZW4gd2llZGVyIHp1csO8Y2sgc2V0emVuIFxyXG5cclxuICAgIH1cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHRpY2soKSB7XHJcbiAgICAgICAgbGV0IG15Y2FudmFzID0gd2luZG93LmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibXljYW52YXNcIilcclxuICAgICAgICBsZXQgY3R4ID0gbXljYW52YXMuZ2V0Q29udGV4dCgnMmQnKVxyXG4gICAgICAgIGN0eC5mb250ID0gXCIxOHB4IEFyaWFsXCI7XHJcblxyXG4gICAgICAgIC8vLS0tIGNsZWFyIHNjcmVlblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgyMzUsIDI1MCwgMjU1LCAwLjEpJyAvLyBhbHBoYSA8IDEgbMO2c2NodCBkZW4gQmlsZHNjaHJpbSBudXIgdGVpbHdlaXNlIC0+IGJld2VndGUgR2VnZW5zdMOkbmRlIGVyemV1Z2VuIFNwdXJlblxyXG4gICAgICAgIGN0eC5maWxsUmVjdCgwLCAwLCBteWNhbnZhcy5jbGllbnRXaWR0aCwgbXljYW52YXMuY2xpZW50SGVpZ2h0KVxyXG5cclxuICAgICAgICAvLy0tLSBkcmF3IGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5kcmF3KGN0eClcclxuXHJcbiAgICAgICAgLy8tLS0gZXhlY3V0ZSBlbGVtZW50IGFjdGlvbnNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFjdGlvbigpXHJcblxyXG4gICAgICAgIC8vLS0tIGNoZWNrIGVsZW1lbnQgY29sbGlzaW9uc1xyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuY2hlY2tDb2xsaXNpb24oKVxyXG4gICAgICAgIC8vIFNwaWVsZXIgdG9kID8gXHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoLmlzRGVhZCgpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVPdmVyKCk7XHJcbiAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlVUkoKVxyXG5cclxuICAgICAgICB0aGlzLnJhZiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy50aWNrLmJpbmQodGhpcykpXHJcbiAgICB9XHJcblxyXG4gICAgaXNXb3JkT25EaXNwbGF5KHdvcmQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpcy5lbGVtZW50TGlzdFtpXSAhPSBudWxsICYmIHRoaXMuZWxlbWVudExpc3RbaV0gaW5zdGFuY2VvZiBXb3JkICYmIHRoaXMuZWxlbWVudExpc3RbaV0ud29yZC5jaGFyQXQoMCkgPT0gd29yZC5jaGFyQXQoMCkgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG4gICAgc2V0dXBJbnB1dCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB0aGlzLnNob290VG9DaXJjbGUoKVxyXG4gICAgICAgICAgICBlbHNlIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScpIHRoaXMuY3VycmVudElucHV0ID0gdGhpcy5jdXJyZW50SW5wdXQuc2xpY2UoMCwgLTEpXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKC9bYS16QS1aXS8udGVzdChlLmtleSkpIHRoaXMuY3VycmVudElucHV0ICs9IGUua2V5LnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVVSSgpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBzaG9vdFRvQ2lyY2xlKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jdXJyZW50SW5wdXQpIHJldHVyblxyXG4gICAgXHJcbiAgICAgICAgLy8gRmluZGUgZGFzIFdPUlQgaW4gZGVyIGVsZW1lbnRMaXN0XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0V29yZCA9IHRoaXMuZWxlbWVudExpc3QuZmluZChlbCA9PiBcclxuICAgICAgICAgICAgZWwgaW5zdGFuY2VvZiBXb3JkICYmICFlbC5oYXNDb2xsaWRlZCAmJiBlbC53b3JkID09PSB0aGlzLmdldEN1cnJlbnRXb3JkKClcclxuICAgICAgICApXHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXRXb3JkKSByZXR1cm5cclxuICAgIFxyXG4gICAgICAgIC8vIERpZSBCdWxsZXQgZmxpZWd0IHp1bSBDSVJDTEUtRUxFTUVOVCAobmljaHQgenVtIFdvcnQpXHJcbiAgICAgICAgLy8gdGFyZ2V0V29yZC5jaXJjbGVJZCBpc3QgZGllIGluc3RhbmNlSWQgZGVzIEtyZWlzZXNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgQnVsbGV0KFxyXG4gICAgICAgICAgICB0YXJnZXRXb3JkLngsICAgICAgICAgICAvLyBaSUVMIFggZGVzIEtyZWlzZXNcclxuICAgICAgICAgICAgdGFyZ2V0V29yZC55LCAgICAgICAgICAgLy8gWklFTCBZIGRlcyBLcmVpc2VzXHJcbiAgICAgICAgICAgIHRhcmdldFdvcmQuY2lyY2xlSWQsICAgIC8vIFRhcmdldCBpc3QgZGVyIEtSRUlTXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApKVxyXG4gICAgICAgIHRoaXMuY3VycmVudElucHV0ID0gJydcclxuICAgIH1cclxuXHJcbiAgICBnZXRDdXJyZW50V29yZCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50SW5wdXRcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVVSSgpIHtcclxuICAgICAgICBjb25zdCBlbCA9IGlkID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxyXG4gICAgICAgIGlmIChlbCgnY3VycmVudC1pbnB1dCcpKSBlbCgnY3VycmVudC1pbnB1dCcpLnRleHRDb250ZW50ID0gdGhpcy5nZXRDdXJyZW50V29yZCgpXHJcbiAgICAgICAgaWYgKGVsKCdzY29yZScpKSBlbCgnc2NvcmUnKS50ZXh0Q29udGVudCA9IHRoaXMuc2NvcmVcclxuICAgIH1cclxuXHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG4vL2NvbnN0IHJhbmRvbXdhbGtjaXJjbGVlbGVtZW50ID0gcmVxdWlyZSgnLi9yYW5kb213YWxrY2lyY2xlZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhlYWx0aCBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkgeyAgXHJcbiAgICAgICAgc3VwZXIoKSAgICAgICAgICAgIFxyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gMztcclxuICAgICAgICB0aGlzLmhlYXJ0ID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5oZWFydC5zcmMgPSAnaW1nL2hlYXJ0LnBuZyc7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7IFxyXG4gICAgICAgIHRoaXMuaGVhcnQub25sb2FkID0gKCkgPT4geyAgICAgICAgICAgICAgICAgICAgLy9sYWRldCBkYXMgYmlsZCBoZWFydFxyXG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIFxyXG5cclxuICAgIGRyYXcoY3R4KXtcclxuICAgICAgICBpZiAoIXRoaXMubG9hZGVkKSByZXR1cm47ICAgICAgICAgICAgICAgICAgICAgICAgICAvL3dlbm4gZGFzIGJpbGQgZ2VsYWRlbiBpc3Qgc29sbHRlIGVzIGRpZSBoZXJ6ZW4gemVpY2huZW5cclxuICAgICAgICBcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPj0gMSkge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKHRoaXMuaGVhcnQsIDEwLDEwLDI1LDI1KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoID49IDIpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZSh0aGlzLmhlYXJ0LCA0MCwxMCwyNSwyNSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgIGN0eC5kcmF3SW1hZ2UodGhpcy5oZWFydCwgNzAsMTAsMjUsMjUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuICAgIHJlZHVjZSgpe1xyXG4gICAgICAgdGhpcy5oZWFsdGgtLTtcclxuICAgIH1cclxuICAgIGlzRGVhZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmhlYWx0aCA8PSAwO1xyXG59XHJcblxyXG4gICAgLypcclxuICAgICAgXHJcbiAgICB1cGRhdGUoKSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDDnGJlcnByw7xmdCBkZW4gZnJhbWUgb2IgaGFzQ29sbGlkZWQgPSB0cnVlIFxyXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbXdhbGtjaXJjbGVlbGVtZW50Lmhhc0NvbGxpZGVkKSB7ICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuaGVhbHRoLS07XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQuaGFzQ29sbGlkZWQgPSBmYWxzZTsgIC8vIHNldHp0IGNvbGxpZGVkIGF1ZiBmYWxzZSBzbyBkYXNzIG51ciBlaW5lIGhlcnogcHJvIGNvbGxpc2lvbiBhYmdlem9nZW4gd2lyZCBcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAgICAgICovIFxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuIFxyXG5jb25zdCBHYW1lID0gcmVxdWlyZShcIi4vZ2FtZVwiKVxyXG5sZXQgbXlHYW1lID0gbmV3IEdhbWUoKVxyXG5teUdhbWUuc3RhcnQoKVxyXG4vLyBiZWltIHRhc3RlbiBkcnVjayBjYW52YXMgemVpZ2VuIHVuZCBtZW7DvCB2ZXJzdGVja2VuIFxyXG5jb25zdCBzdGFydEJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnQtYnV0dG9uXCIpOyBcclxuc3RhcnRCdXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpbi1tZW51XCIpLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjsgLy8gdmVyc3RlY2t0IGRhcyBtYWluIG1lbsO8IFxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteWNhbnZhc1wiKS5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7IC8vIHplaWd0IGNhbnZhcyB3aWVkZXIgYXVmXHJcbiAgICBteUdhbWUuc3RhcnQoKTtcclxufTtcclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZSgnLi93b3JkJylcclxuY29uc3QgSGVhbHRoID0gcmVxdWlyZSgnLi9oZWFsdGgnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLmdhbWUgPSBnYW1lXHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5yYW5kb20oKSAqIDUzMCArIDQwXHJcbiAgICAgICAgdGhpcy55ID0gMFxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSAwLjcgICAgICAgICAgICAgICAgICAgIC8vb3JnaW5hbCBzcGVlZCA9IDAuNzsgaWNoIHZlcsOkbmRlcmUgZXMgenVtIHRlc3RlbiBcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgXHJcbiAgICAgICAgICAgIGxldCB3b3JkID0gbmV3IFdvcmQodGhpcy5nYW1lLCB0aGlzLngsIHRoaXMueSwgdGhpcy5pbnN0YW5jZUlkLCB0aGlzLnNwZWVkKVxyXG4gICAgICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuYWRkKHdvcmQpXHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICAgICAgY3R4LmFyYyh0aGlzLngsIHRoaXMueSwgMTUsIDAsIE1hdGguUEkgKiAyLCB0cnVlKVxyXG4gICAgICAgICAgICBjdHguY2xvc2VQYXRoKClcclxuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwiZ3JleVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuICAgIH1cclxuXHJcbiAgICBjYWxsQnVyc3QoKSB7XHJcbiAgICAgICAgdmFyIGJ1cnN0ID0gbmV3IEJ1cnN0KHRoaXMueCwgdGhpcy55LCB0aGlzLmdhbWUpXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZChidXJzdClcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDIgLSAxXHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWRcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy55ID4gNTUwICYmIHRoaXMueSA8PSA1NTAgKyB0aGlzLnNwZWVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKTtcclxuICAgICAgICB0aGlzLmNhbGxCdXJzdCgpIFxyXG4gICAgICAgIHRoaXMuZ2FtZS5oZWFsdGgucmVkdWNlKCk7ICAgICAgICAgICAgIFxyXG4gICAgfVxyXG59IiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBTdGFnZSBleHRlbmRzIEVsZW1lbnQge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLnggPSAwXHJcbiAgICAgICAgdGhpcy55ID0gMFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgdmFyIGltZyA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgaW1nLnNyYyA9ICdpbWcvYmFja2dyb3VuZC5wbmcnO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICBcclxuICAgIH1cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5jb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgV29yZCBleHRlbmRzIEVsZW1lbnQge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZSwgeCwgeSwgY2lyY2xlSWQsIHNwZWVkKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuZGVzdHJveWVkID0gZmFsc2UgXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMuY2lyY2xlSWQgPSBjaXJjbGVJZFxyXG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZFxyXG4gICAgICAgIGNvbnN0IHdvcmRMaXN0ID0gWydSb2NrJywnUGFwZXInLCdTY2lzc29yJywnQXBwbGUnLCdPcmFuZ2UnLCdCYW5hbmEnLCdHcmFwZScsJ01hbmdvJywnTGVtb24nLCdMaW1lJywnQ2hlcnJ5JywnUGVhcicsJ1BlYWNoJywnUGx1bScsJ0Fwcmljb3QnLCdGaWcnLCdEYXRlJywnS2l3aScsJ01lbG9uJywnQmVycnknLCdTdHJhdycsJ1N0b25lJywnV2F0ZXInLCdGaXJlJywnRWFydGgnLCdXaW5kJywnU2t5JywnQ2xvdWQnLCdSYWluJywnU3Rvcm0nLCdUaHVuZGVyJywnTGlnaHRuaW5nJywnUml2ZXInLCdPY2VhbicsJ1NlYScsJ0xha2UnLCdQb25kJywnU3RyZWFtJywnSGlsbCcsJ01vdW50YWluJywnVmFsbGV5JywnRm9yZXN0JywnV29vZHMnLCdKdW5nbGUnLCdEZXNlcnQnLCdJc2xhbmQnLCdDb2FzdCcsJ1Nob3JlJywnQmVhY2gnLCdTYW5kJywnRGlydCcsJ1NvaWwnLCdHcmFzcycsJ0xlYWYnLCdUcmVlJywnQnJhbmNoJywnUm9vdCcsJ0Zsb3dlcicsJ1BldGFsJywnU2VlZCcsJ1BsYW50JywnSGVyYicsJ1ZpbmUnLCdCYXJrJywnU3RlbScsJ01vc3MnLCdGdW5naScsJ011c2hyb29tJywnQW5pbWFsJywnQmlyZCcsJ0Zpc2gnLCdJbnNlY3QnLCdCZWFzdCcsJ0NyZWF0dXJlJywnSHVtYW4nLCdQZXJzb24nLCdDaGlsZCcsJ0FkdWx0JywnTWFuJywnV29tYW4nLCdCb3knLCdHaXJsJywnRnJpZW5kJywnTmVpZ2hib3InLCdEb2N0b3InLCdUZWFjaGVyJywnU3R1ZGVudCcsJ1BpbG90JywnRHJpdmVyJywnRmFybWVyJywnSHVudGVyJywnU2luZ2VyJywnRGFuY2VyJywnQXJ0aXN0JywnV3JpdGVyJywnUmVhZGVyJywnTGVhZGVyJywnV29ya2VyJywnQnVpbGRlcicsJ01ha2VyJywnQ29vaycsJ0Jha2VyJywnU29sZGllcicsJ09mZmljZXInLCdHdWFyZCcsJ0tpbmcnLCdRdWVlbicsJ1ByaW5jZScsJ1ByaW5jZXNzJywnS25pZ2h0JywnV2l6YXJkJywnSGVybycsJ0dpYW50JywnRHdhcmYnLCdSb2JvdCcsJ0FsaWVuJywnTW9uc3RlcicsJ0FuZ2VsJywnRGVtb24nLCdTcGlyaXQnLCdHaG9zdCcsJ1NoYWRvdycsJ0xpZ2h0JywnRGFyaycsJ0JyaWdodCcsJ0RpbScsJ1NoYXJwJywnQmx1bnQnLCdTb2Z0JywnSGFyZCcsJ1N0cm9uZycsJ1dlYWsnLCdRdWljaycsJ1Nsb3cnLCdGYXN0JywnSGVhdnknLCdMaWdodHdlaWdodCcsJ1NtYWxsJywnTGFyZ2UnLCdIdWdlJywnVGlueScsJ1Nob3J0JywnVGFsbCcsJ1dpZGUnLCdOYXJyb3cnLCdEZWVwJywnU2hhbGxvdycsJ05ldycsJ09sZCcsJ1lvdW5nJywnQW5jaWVudCcsJ0ZyZXNoJywnU3RhbGUnLCdIb3QnLCdDb2xkJywnV2FybScsJ0Nvb2wnLCdEcnknLCdXZXQnLCdDbGVhbicsJ0RpcnR5JywnU3dlZXQnLCdTb3VyJywnQml0dGVyJywnU2FsdHknLCdTcGljeScsJ1BsYWluJywnSGFwcHknLCdTYWQnLCdBbmdyeScsJ0NhbG0nLCdCcmF2ZScsJ1NoeScsJ1BvbGl0ZScsJ1J1ZGUnLCdLaW5kJywnTWVhbicsJ1NtYXJ0JywnRHVsbCcsJ0NsZXZlcicsJ1dpc2UnLCdTaWxseScsJ0Z1bm55JywnU2VyaW91cycsJ1JlYWR5JywnQmFzaWMnLCdTaW1wbGUnLCdDb21wbGV4JywnRGlmZmljdWx0JywnRWFzeScsJ1Bvc3NpYmxlJywnQ2VydGFpbicsJ1JhbmRvbScsJ0NvbW1vbicsJ1JhcmUnLCdGYW1vdXMnLCdVbmtub3duJywnRW1wdHknLCdGdWxsJywnT3BlbicsJ0Nsb3NlZCcsJ0Vhcmx5JywnTGF0ZScsJ0ZpcnN0JywnTGFzdCcsJ1JpZ2h0JywnTGVmdCcsJ05vcnRoJywnU291dGgnLCdFYXN0JywnV2VzdCcsJ0luc2lkZScsJ091dHNpZGUnLCdBYm92ZScsJ0JlbG93JywnRnJvbnQnLCdCYWNrJywnTmVhcicsJ0ZhcicsJ0hlcmUnLCdUaGVyZScsJ0V2ZXJ5d2hlcmUnLCdTb21ld2hlcmUnLCdOb3doZXJlJywnQWx3YXlzJywnTmV2ZXInLCdTb21ldGltZXMnLCdPZnRlbicsJ1NlbGRvbScsJ0RhaWx5JywnV2Vla2x5JywnTW9udGhseScsJ1llYXJseScsJ01vbWVudCcsJ1NlY29uZCcsJ01pbnV0ZScsJ0hvdXInLCdEYXknLCdXZWVrJywnTW9udGgnLCdZZWFyJywnRGVjYWRlJywnQ2VudHVyeScsJ1RpbWUnLCdDbG9jaycsJ1dhdGNoJywnTW9ybmluZycsJ05vb24nLCdFdmVuaW5nJywnTmlnaHQnLCdNaWRuaWdodCcsJ1N1bicsJ01vb24nLCdTdGFyJywnUGxhbmV0JywnV29ybGQnLCdVbml2ZXJzZScsJ0dhbGF4eScsJ1NwYWNlJywnVm9pZCcsJ0VuZXJneScsJ1Bvd2VyJywnRm9yY2UnLCdNb3Rpb24nLCdTcGVlZCcsJ0dyYXZpdHknLCdBdG9tJywnQ2VsbCcsJ01hdHRlcicsJ09iamVjdCcsJ0l0ZW0nLCdUaGluZycsJ1Rvb2wnLCdEZXZpY2UnLCdNYWNoaW5lJywnRW5naW5lJywnTW90b3InLCdDYXInLCdUcnVjaycsJ0J1cycsJ1RyYWluJywnUGxhbmUnLCdCb2F0JywnU2hpcCcsJ0Jpa2UnLCdDeWNsZScsJ1doZWVsJywnUm9hZCcsJ1BhdGgnLCdUcmFpbCcsJ0JyaWRnZScsJ1R1bm5lbCcsJ1Rvd2VyJywnSG91c2UnLCdIb21lJywnUm9vbScsJ0Rvb3InLCdXaW5kb3cnLCdXYWxsJywnRmxvb3InLCdDZWlsaW5nJywnUm9vZicsJ0hhbGwnLCdHYXJkZW4nLCdZYXJkJywnRmFybScsJ0Jhcm4nLCdNYXJrZXQnLCdTdG9yZScsJ1Nob3AnLCdNYWxsJywnTGlicmFyeScsJ1NjaG9vbCcsJ09mZmljZScsJ0ZhY3RvcnknLCdDaHVyY2gnLCdUZW1wbGUnLCdDYXN0bGUnLCdQYWxhY2UnLCdWaWxsYWdlJywnVG93bicsJ0NpdHknLCdDb3VudHJ5JywnTmF0aW9uJywnS2luZ2RvbScsJ0VtcGlyZScsJ0FybXknLCdOYXZ5JywnUG9saWNlJywnQ291cnQnLCdMYXcnLCdKdWRnZScsJ0NyaW1lJywnSnVyeScsJ1RyaWFsJywnTW9uZXknLCdDYXNoJywnQ29pbicsJ0NyZWRpdCcsJ0RlYml0JywnQmFuaycsJ1ZhbHVlJywnUHJpY2UnLCdDb3N0JywnVHJhZGUnLCdTYWxlJywnU3RvcmUnLCdCdXllcicsJ1NlbGxlcicsJ0dpZnQnLCdQcmVzZW50JywnUHJpemUnLCdSZXdhcmQnLCdUcmVhc3VyZScsJ0dvbGQnLCdTaWx2ZXInLCdDb3BwZXInLCdJcm9uJywnU3RlZWwnLCdTdG9uZScsJ0JyaWNrJywnV29vZCcsJ1BhcGVyJywnQ2xvdGgnLCdMZWF0aGVyJywnR2xhc3MnLCdQbGFzdGljJywnUnViYmVyJywnU3RyaW5nJywnUm9wZScsJ0NoYWluJywnQmxhZGUnLCdTd29yZCcsJ0tuaWZlJywnQXhlJywnSGFtbWVyJywnV3JlbmNoJywnU2NyZXcnLCdOYWlsJywnQm9sdCcsJ0RyaWxsJywnU2F3JywnQnJ1c2gnLCdQYWludCcsJ0NvbG9yJywnSW5rJywnUGVuJywnUGVuY2lsJywnTWFya2VyJywnQm9vaycsJ1BhZ2UnLCdTdG9yeScsJ1BvZW0nLCdTb25nJywnTXVzaWMnLCdTb3VuZCcsJ05vaXNlJywnVm9pY2UnLCdXb3JkJywnTGV0dGVyJywnUGhyYXNlJywnU2VudGVuY2UnLCdMaW5lJywnUGFyYWdyYXBoJywnTm92ZWwnLCdEcmFtYScsJ0NvbWVkeScsJ1RyYWdlZHknLCdNb3ZpZScsJ0ZpbG0nLCdTY2VuZScsJ0FjdG9yJywnU3RhZ2UnLCdTY3JlZW4nLCdJbWFnZScsJ1BpY3R1cmUnLCdQaG90bycsJ1ZpZGVvJywnQ2FtZXJhJywnTGlnaHQnLCdMYW1wJywnQ2FuZGxlJywnRmlyZXBsYWNlJywnT3ZlbicsJ1N0b3ZlJywnRnJpZGdlJywnVGFibGUnLCdDaGFpcicsJ0Rlc2snLCdCZWQnLCdDb3VjaCcsJ1NvZmEnLCdTaGVsZicsJ0NhYmluZXQnLCdNaXJyb3InLCdDbG9jaycsJ0JhZycsJ0JveCcsJ0JvdHRsZScsJ0N1cCcsJ0dsYXNzJywnUGxhdGUnLCdCb3dsJywnRm9yaycsJ1Nwb29uJywnS25pZmUnLCdNZWFsJywnRm9vZCcsJ0RyaW5rJywnQnJlYWQnLCdSaWNlJywnTWVhdCcsJ0Zpc2gnLCdFZ2cnLCdNaWxrJywnQ2hlZXNlJywnQnV0dGVyJywnU3VnYXInLCdTYWx0JywnUGVwcGVyJywnU3BpY2UnLCdTb3VwJywnU3RldycsJ1NhdWNlJywnRnJ1aXQnLCdWZWdldGFibGUnLCdDYXJyb3QnLCdQb3RhdG8nLCdUb21hdG8nLCdPbmlvbicsJ0dhcmxpYycsJ1BlcHBlcicsJ0Nvcm4nLCdCZWFuJywnUGVhJywnU3BpbmFjaCcsJ0Jyb2Njb2xpJywnQ2FiYmFnZScsJ0xldHR1Y2UnLCdUZWEnLCdDb2ZmZWUnLCdKdWljZScsJ1dhdGVyJywnU29kYScsJ1dpbmUnLCdCZWVyJywnQnJlYWtmYXN0JywnTHVuY2gnLCdEaW5uZXInLCdTbmFjaycsJ0ZlYXN0JywnUGFydHknLCdHYW1lJywnU3BvcnQnLCdNYXRjaCcsJ1dpbicsJ0xvc3MnLCdTY29yZScsJ0dvYWwnLCdQb2ludCcsJ1RlYW0nLCdQbGF5ZXInLCdDb2FjaCcsJ0p1ZGdlJywnUmVmZXJlZScsJ1JhY2UnLCdSdW4nLCdXYWxrJywnSnVtcCcsJ1N3aW0nLCdDbGltYicsJ1Rocm93JywnQ2F0Y2gnLCdIaXQnLCdLaWNrJywnUHVzaCcsJ1B1bGwnLCdMaWZ0JywnRHJvcCcsJ0hvbGQnLCdUb3VjaCcsJ0xvb2snLCdTZWUnLCdIZWFyJywnTGlzdGVuJywnU3BlYWsnLCdUYWxrJywnU2F5JywnVGVsbCcsJ1dyaXRlJywnUmVhZCcsJ1RoaW5rJywnS25vdycsJ0xlYXJuJywnVGVhY2gnLCdVbmRlcnN0YW5kJywnQmVsaWV2ZScsJ0ltYWdpbmUnLCdSZW1lbWJlcicsJ0ZvcmdldCcsJ0xvdmUnLCdIYXRlJywnRmVhcicsJ0hvcGUnLCdEcmVhbScsJ1NsZWVwJywnV2FrZScsJ0xpdmUnLCdEaWUnLCdHcm93JywnU2hyaW5rJywnQ2hhbmdlJywnU3RheScsJ01vdmUnLCdUcmF2ZWwnLCdWaXNpdCcsJ0V4cGxvcmUnLCdTZWFyY2gnLCdGaW5kJywnTG9zZScsJ0J1aWxkJywnQnJlYWsnLCdGaXgnLCdDcmVhdGUnLCdEZXN0cm95JywnT3BlbicsJ0Nsb3NlJywnU3RhcnQnLCdTdG9wJywnQmVnaW4nLCdFbmQnLCdDb250aW51ZScsJ1JldHVybicsJ0ZvbGxvdycsJ0xlYWQnLCdTdXBwb3J0JywnSGVscCcsJ1NhdmUnLCdQcm90ZWN0JywnQXR0YWNrJywnRGVmZW5kJywnSm9pbicsJ0xlYXZlJywnRW50ZXInLCdFeGl0JywnQ2xvdGgnLCdTaGlydCcsJ1BhbnRzJywnRHJlc3MnLCdTa2lydCcsJ0NvYXQnLCdIYXQnLCdCb290JywnU2hvZScsJ1NvY2snLCdHbG92ZScsJ0JlbHQnLCdSaW5nJywnTmVja2xhY2UnLCdCcmFjZWxldCcsJ1dhdGNoJywnV2FsbGV0JywnUHVyc2UnLCdQaG9uZScsJ1RhYmxldCcsJ0xhcHRvcCcsJ0NvbXB1dGVyJywnS2V5Ym9hcmQnLCdNb3VzZScsJ1NjcmVlbicsJ01vbml0b3InLCdDYWJsZScsJ1dpcmUnLCdTaWduYWwnLCdOZXR3b3JrJywnV2Vic2l0ZScsJ0ludGVybmV0JywnU29mdHdhcmUnLCdQcm9ncmFtJywnRmlsZScsJ0ZvbGRlcicsJ0RhdGEnLCdDb2RlJywnRXJyb3InLCdTeXN0ZW0nLCdMb2dpYycsJ01ldGhvZCcsJ1RoZW9yeScsJ01vZGVsJywnUGF0dGVybicsJ1N0cnVjdHVyZScsJ1NoYXBlJywnRm9ybScsJ0NpcmNsZScsJ1NxdWFyZScsJ1RyaWFuZ2xlJywnQ3ViZScsJ1NwaGVyZScsJ0xpbmUnLCdQb2ludCcsJ0FuZ2xlJywnQ3VydmUnLCdFZGdlJywnU2lkZScsJ0NlbnRlcicsJ0xldmVsJywnU3RhdHVzJywnT3B0aW9uJywnQ2hvaWNlJywnQ2hhbmNlJywnUmlzaycsJ1BsYW4nLCdJZGVhJywnR29hbCcsJ0RyZWFtJywnV2lzaCcsJ09yZGVyJywnUnVsZScsJ0d1aWRlJywnTWFwJywnTGlzdCcsJ0NoYXJ0JywnR3JhcGgnLCdUYWJsZScsJ1Rlc3QnLCdFeGFtJywnUXVpeicsJ0xlc3NvbicsJ0NsYXNzJywnQ291cnNlJywnU2tpbGwnLCdUYWxlbnQnLCdBcnQnLCdTY2llbmNlJywnTWF0aCcsJ0hpc3RvcnknLCdHZW9ncmFwaHknLCdQaHlzaWNzJywnQ2hlbWlzdHJ5JywnQmlvbG9neScsJ0Vjb25vbXknLCdNYXJrZXQnLCdUcmFkZScsJ0J1c2luZXNzJywnQ29tcGFueScsJ09mZmljZScsJ1dvcmtlcicsJ01hbmFnZXInLCdMZWFkZXInLCdCb3NzJywnT3duZXInLCdQYXJ0bmVyJywnQ2xpZW50JywnQ3VzdG9tZXInLCdTZXJ2aWNlJywnUHJvZHVjdCcsJ0JyYW5kJywnTW9kZWwnLCdWZXJzaW9uJywnTWFya2V0JywnSW5kdXN0cnknLCdUZWNobm9sb2d5JywnRGVzaWduJywnU3R5bGUnLCdRdWFsaXR5JywnRmVhdHVyZScsJ0Z1bmN0aW9uJywnUHVycG9zZScsJ0VmZmVjdCcsJ0NhdXNlJywnUmVzdWx0JywnVmljdG9yeScsJ0ZhaWx1cmUnLCdTdWNjZXNzJywnRWZmb3J0JywnRm9jdXMnLCdIb25vcicsJ0dsb3J5JywnVHJ1dGgnLCdGYWl0aCcsJ1RydXN0JywnUGVhY2UnLCdXYXInLCdCYXR0bGUnLCdGaWdodCcsJ1dlYXBvbicsJ1NoaWVsZCcsJ0FybW9yJywnRmxhZycsJ1N5bWJvbCcsJ1NpZ24nLCdNZXNzYWdlJywnTm90aWNlJywnTmV3cycsJ1JlcG9ydCcsJ1BhcGVyJywnQXJ0aWNsZScsJ0xldHRlcicsJ0VtYWlsJywnVGV4dCcsJ0NoYXQnLCdDYWxsJywnU2lnbmFsJywnQWxlcnQnLCdXYXJuaW5nJywnRGFuZ2VyJywnU2FmZXR5JywnSGVhbHRoJywnQm9keScsJ0hlYXJ0JywnTWluZCcsJ0JyYWluJywnSGFuZCcsJ0Zvb3QnLCdFeWUnLCdFYXInLCdNb3V0aCcsJ05vc2UnLCdGYWNlJywnSGFpcicsJ1NraW4nLCdCb25lJywnQmxvb2QnLCdCcmVhdGgnLCdMaWZlJywnRGVhdGgnLCdCaXJ0aCcsJ0NoaWxkaG9vZCcsJ1lvdXRoJywnQWR1bHQnLCdFbGRlcicsJ0Z1dHVyZScsJ1Bhc3QnLCdQcmVzZW50J11cclxuICAgICAgICB0aGlzLndvcmQgPSB3b3JkTGlzdFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqd29yZExpc3QubGVuZ3RoKV1cclxuICAgICAgICB3aGlsZSAoZ2FtZS5pc1dvcmRPbkRpc3BsYXkodGhpcy53b3JkKSkge1xyXG4gICAgICAgICAgICB0aGlzLndvcmQgPSB3b3JkTGlzdFtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqd29yZExpc3QubGVuZ3RoKV1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy54ID0geCAtIHRoaXMud29yZC5sZW5ndGgqOC8yXHJcbiAgICAgICAgdGhpcy55ID0geSArIDMwXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiXHJcbiAgICAgICAgY3R4LmZpbGxUZXh0KHRoaXMud29yZCwgdGhpcy54LCB0aGlzLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgICAgICB0aGlzLnkgKz0gdGhpcy5zcGVlZFxyXG4gICAgICAgICAgICBpZiAodGhpcy55ID4gd2luZG93LmlubmVySGVpZ2h0IC0gODApIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmdhbWUuZWxlbWVudExpc3QuZ2V0KHRoaXMuY2lyY2xlSWQpID09IG51bGwpIHsgLy9pZiBpdCBpcyBudWxsLCB0aGF0IG1lYW5zIHRoZSBjaXJjbGUgaGFzIGNvbGxpZGVkXHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHtcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gdHJ1ZVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5kZWxldGUodGhpcy5pbnN0YW5jZUlkKTtcclxuICAgIH1cclxufVxyXG4iXX0=
