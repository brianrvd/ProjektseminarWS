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
        //Änderung von Brian
       

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
const Validator = require('./validator')
const WordInputHandler = require('./wordinputhandler')


module.exports = class Game {

    constructor() {
        this.raf                       // request animation frame handle
        this.elementList = null
        this.score = 0 
        this.currentInput = ''
        // Änderungen von Brian
        this.validator = new Validator();
        this.wordInputhander = new WordInputHandler();
        this.activeWordElement = null;
        this.wordInputhander.setLetterCallback(this.handleLetterInput.bind(this));
        


    }

    //----------------------

    start() {
        this.elementList = new ElementList()
        //this.setupInput()
        this.elementList.add(new Stage());
        for (let i = 0; i < 60; i++) {
            setTimeout(() => { 
                this.elementList.add(new RandomWalkCircleElement(this));
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
        ctx.font = "18px Arial";

        
    
        
        //--- clear screen
        ctx.fillStyle = 'rgba(235, 250, 255, 0.1)' // alpha < 1 löscht den Bildschrim nur teilweise -> bewegte Gegenstände erzeugen Spuren
        ctx.fillRect(0, 0, mycanvas.clientWidth, mycanvas.clientHeight)

        //Änderungen von Brian (test)
         

        //--- draw elements
        this.elementList.draw(ctx)

        //--- execute elemenSt actions
        this.elementList.action()

        //--- check element collisions
        this.elementList.checkCollision()

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
    
    /*setupInput() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.shootToCircle()
            else if (e.key === 'Backspace') this.currentInput = this.currentInput.slice(0, -1)
            else if (/[a-zA-Z]/.test(e.key)) this.currentInput += e.key.toLowerCase()
            this.updateUI()
        })
    }*/

    /*shootToCircle() {
        if (!this.currentInput) returncable
    
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
    }*/

    getCurrentWord() {
        return this.currentInput
    }

    updateUI() {
        const el = id => document.getElementById(id)
        if (el('current-input')) el('current-input').textContent = this.getCurrentWord()
        if (el('score')) el('score').textContent = this.score
    }
    

handleLetterInput(letter) {
    // Wenn kein Wort aktiv ist, suche ein neues
    if (!this.activeWordElement) {
        this.findNewWord(letter);
    } 
    // Wenn Wort aktiv ist, tippe weiter
    else {
        this.continueTypingWord(letter);
    }
}

// Sucht ein neues Wort basierend auf erstem Buchstaben
findNewWord(firstLetter) {
    
    const activeWords = [];
    for (let i = 0; i < this.elementList.length; i++) {
        const el = this.elementList[i];
        if (el instanceof Word && !el.hasCollided) {
            activeWords.push(el);
        }
    }
    
    // Finde das ERSTE Wort das mit dem Buchstaben beginnt
    const matchingWord = activeWords.find(word => 
        word.word.toLowerCase().startsWith(firstLetter)
    );
    
    if (matchingWord) {
        this.activeWordElement = matchingWord;
        this.currentInput = firstLetter;
        
    }
}

    // Tippe am aktiven Wort weiter
    continueTypingWord(letter) {
        const expectedNextLetter = this.activeWordElement.word.toLowerCase()[this.currentInput.length];
    
        // Prüfe ob der Buchstabe korrekt ist
        if (letter === expectedNextLetter) {
            this.currentInput += letter;
        
        
            // Prüfe ob Wort vollständig
            if (this.currentInput === this.activeWordElement.word.toLowerCase()) {
                this.onWordCompleted();
            }
            } else {
                // Falscher Buchstabe - Reset
                this.resetActiveWord();
        }
    }


    // Wort erfolgreich abgetippt
    onWordCompleted() {
        
        // Kugel auf den Kreis schießen
        const targetCircle = this.elementList.get(this.activeWordElement.circleId);
    if (targetCircle) {
        this.elementList.add(new Bullet(
            targetCircle.x,
            targetCircle.y,
            this.activeWordElement.circleId,this));
    }
    
    
    this.resetActiveWord();
    }

// Aktives Wort zurücksetzen
resetActiveWord() {
    this.activeWordElement = null;
    this.currentInput = '';
}

// Prüfe in jedem Frame ob aktives Wort noch existiert
checkActiveWordValidity() {
    if (this.activeWordElement) {
        let wordStillExists = false;
        
        // Durchsuche die ElementList manuell
        for (let i = 0; i < this.elementList.length; i++) {
            const el = this.elementList[i];
            if (el === this.activeWordElement && !el.hasCollided) {
                wordStillExists = true;
                break;
            }
        }
        
        if (!wordStillExists) {
            
            this.resetActiveWord();
        }
    }
}



}

},{"./bullet":1,"./burst":2,"./elementlist":4,"./randomwalkcircleelement":7,"./stage":8,"./validator":9,"./word":10,"./wordinputhandler":11}],6:[function(require,module,exports){
"use strict"
 
const Game = require("./game")
let myGame = new Game()
myGame.start()
},{"./game":5}],7:[function(require,module,exports){
"use strict"

const Element = require('./element')
const Burst = require('./burst')
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
            ctx.beginPath()
            ctx.arc(this.x, this.y, 15, 0, Math.PI * 2, true)
            ctx.closePath()
            
            ctx.fillStyle =  "grey"
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
    }
    
}
},{"./burst":2,"./element":3,"./word":10}],8:[function(require,module,exports){
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
},{"./element":3}],9:[function(require,module,exports){
module.exports = class Validator {

constructor(){
  this.activeWord = "";
  this.currentInput = "";
  //this.currentSpot=0;
  //this.wordLocked = false;
}



setActiveWord(word){
    this.activeWord = word.toLowerCase();
    this.currentInput = ""
    //this.wordLocked = false;
    //this.currentSpot = 0;
}

checkLetter(letter){
    //const expectedChar = this.targetWord[this.currentSpot];
    if(/*!this.wordLocked ||*/ !this.activeWord){
        return false;    
    }

    const expectedChar = this.activeWord[this.currentInput.length];

    if(letter === expectedChar){
        this.currentInput += letter;
        return true;
    }
    return false;


}


isWordComplete(){
    return this.activeWord && this.currentInput === this.activeWord;
}
getActiveWord(){
    return this.activeWord;
}
reset(){
    this.currentInput = "";
    this.activeWord = null;
    //this.wordLocked = false;
}

getCurrentInput(){
    return this.currentInput;
}
hasActiveWord(){
    return this.activeWord !== "";
}

}
},{}],10:[function(require,module,exports){
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
        /*änderungen von Brian
        if (this.game.activeWordElement === this){
            this.game.resetActiveWord();
        }*/
    }
}

},{"./element":3}],11:[function(require,module,exports){
'use strict'

module.exports = class WordInputHandler{

    constructor(){
        this.inputLine= null;
        

        document.addEventListener('keydown', this.handleInput.bind(this));
    }

    setLetterCallback(callback){
        this.inputLine = callback;
    }

    handleInput(event){
        if(event.key.length==1 && /[a-zA-Z]/.test(event.key)){
            const letter= event.key.toLowerCase();
            
            if(this.inputLine){
                this.inputLine(letter);
            }   
            
        }
    }
    
    /*
    notify(letter){
        //hier werden die anderen klassen von dem neuen buchstaben notifiert
        // evtl überflüssig
    }

    getInput(){
        return this.input;
    }

    resetInput(){
        this.input= "";
    }*/
}
},{}]},{},[6])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcERhdGEvUm9hbWluZy9ucG0vbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJnYW1lL2J1bGxldC5qcyIsImdhbWUvYnVyc3QuanMiLCJnYW1lL2VsZW1lbnQuanMiLCJnYW1lL2VsZW1lbnRsaXN0LmpzIiwiZ2FtZS9nYW1lLmpzIiwiZ2FtZS9tYWluLmpzIiwiZ2FtZS9yYW5kb213YWxrY2lyY2xlZWxlbWVudC5qcyIsImdhbWUvc3RhZ2UuanMiLCJnYW1lL3ZhbGlkYXRvci5qcyIsImdhbWUvd29yZC5qcyIsImdhbWUvd29yZGlucHV0aGFuZGxlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJjb25zdCBFbGVtZW50ID0gcmVxdWlyZSgnLi9lbGVtZW50JylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQnVsbGV0IGV4dGVuZHMgRWxlbWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXRYLCB0YXJnZXRZLCB0YXJnZXRJZCwgZ2FtZSkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICAvLyBTdGFydHBvc2l0aW9uOiBGZXN0LCB3aWUgZHUgd2lsbHN0XHJcbiAgICAgICAgdGhpcy54ID0gMjcwXHJcbiAgICAgICAgdGhpcy55ID0gNTIwXHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy50YXJnZXRYID0gdGFyZ2V0WFxyXG4gICAgICAgIHRoaXMudGFyZ2V0WSA9IHRhcmdldFlcclxuICAgICAgICB0aGlzLnRhcmdldElkID0gdGFyZ2V0SWQgIC8vIGluc3RhbmNlSWQgZGVzIFpJRUwtS3JlaXNlc1xyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLmhhc0NvbGxpZGVkID0gZmFsc2VcclxuICAgICAgICBcclxuICAgICAgICAvLyBSaWNodHVuZ3N2ZWt0b3JcclxuICAgICAgICBjb25zdCBkeCA9IHRhcmdldFggLSB0aGlzLnhcclxuICAgICAgICBjb25zdCBkeSA9IHRhcmdldFkgLSB0aGlzLnlcclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdChkeCwgZHkpIHx8IDFcclxuICAgICAgICB0aGlzLnZ4ID0gKGR4IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgdGhpcy52eSA9IChkeSAvIGRpc3QpICogOFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlkZWQpIHJldHVyblxyXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSAnI2ZmMCdcclxuICAgICAgICBjdHguYmVnaW5QYXRoKClcclxuICAgICAgICBjdHguYXJjKHRoaXMueCwgdGhpcy55LCA1LCAwLCBNYXRoLlBJICogMilcclxuICAgICAgICBjdHguZmlsbCgpXHJcbiAgICAgICAgXHJcbiAgICAgICAgY3R4LnNoYWRvd0JsdXIgPSAxMFxyXG4gICAgICAgIGN0eC5zaGFkb3dDb2xvciA9ICcjZmYwJ1xyXG4gICAgICAgIGN0eC5maWxsKClcclxuICAgICAgICBjdHguc2hhZG93Qmx1ciA9IDBcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29sbGlkZWQpIHJldHVyblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFppZWwtS3JlaXMtUG9zaXRpb24gYWt0dWFsaXNpZXJlbiAoZXIgYmV3ZWd0IHNpY2ghKVxyXG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5nZXQodGhpcy50YXJnZXRJZClcclxuICAgICAgICBpZiAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0WCA9IHRhcmdldC54XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0WSA9IHRhcmdldC55XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zdCBkeCA9IHRoaXMudGFyZ2V0WCAtIHRoaXMueFxyXG4gICAgICAgICAgICBjb25zdCBkeSA9IHRoaXMudGFyZ2V0WSAtIHRoaXMueVxyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdChkeCwgZHkpIHx8IDFcclxuICAgICAgICAgICAgdGhpcy52eCA9IChkeCAvIGRpc3QpICogOFxyXG4gICAgICAgICAgICB0aGlzLnZ5ID0gKGR5IC8gZGlzdCkgKiA4XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMueCArPSB0aGlzLnZ4XHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMudnlcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLnRhcmdldElkKSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkaXN0ID0gTWF0aC5oeXBvdCh0aGlzLnRhcmdldFggLSB0aGlzLngsIHRoaXMudGFyZ2V0WSAtIHRoaXMueSlcclxuICAgICAgICBpZiAoZGlzdCA8IDE1KSB7XHJcbiAgICAgICAgICAgIHRoaXMub25Db2xsaXNpb24oKVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy54IDwgMCB8fCB0aGlzLnggPiB3aW5kb3cuaW5uZXJXaWR0aCB8fCBcclxuICAgICAgICAgICAgdGhpcy55IDwgMCB8fCB0aGlzLnkgPiB3aW5kb3cuaW5uZXJIZWlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbGxpc2lvbigpXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICB9XHJcbn1cclxuIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKVxyXG5jb25zdCBHYW1lID0gcmVxdWlyZSgnLi9nYW1lJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgQnVyc3QgZXh0ZW5kcyBFbGVtZW50IHtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5LCBnYW1lKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLnggPSB4XHJcbiAgICAgICAgdGhpcy55ID0geVxyXG4gICAgICAgIHRoaXMuc2l6ZSA9IDE1ICAgXHJcbiAgICAgICAgdGhpcy5jaGVja0NvbGxpc2lvbigpXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgY3R4LmRyYXdJbWFnZShpbWcsIHRoaXMueCAtIDEwLCB0aGlzLnkgLSAxMCwgMzAsIDMwKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSAnaW1nL2V4cGxvc2lvbi5wbmcnO1xyXG4gICAgfVxyXG5cclxuICAgIGFjdGlvbigpIHtcclxuICAgICAgICAvL3RoaXMueCArPSBNYXRoLnJhbmRvbSgpICogMiAtIDFcclxuICAgIH1cclxuICAgIFxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7IFxyXG4gICAgICAgIGlmKHRoaXMuaW5zdGFuY2VJZCAhPSAtMSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICB9LCA3MDApOyAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uQ29sbGlzaW9uKCkge1xyXG4gICAgICAgIHRoaXMuaGFzQ29sbGlkZWQgPSB0cnVlXHJcbiAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmRlbGV0ZSh0aGlzLmluc3RhbmNlSWQpXHJcbiAgICB9XHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbGVtZW50IHtcclxuXHJcbiAgICBoYXNDb2xsaWRlZCA9IGZhbHNlXHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUlkID0gLTFcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7IH1cclxuXHJcbiAgICBkcmF3KGN0eCkgeyB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7IH1cclxuXHJcbiAgICBvbkNvbGxpc2lvbigpIHsgfVxyXG5cclxuICAgIHNldElkKGlkKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZUlkID0gaWRcclxuICAgIH1cclxufSIsIlwidXNlIHN0cmljdFwiXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEVsZW1lbnRMaXN0IGV4dGVuZHMgQXJyYXkge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgIH1cclxuXHJcbiAgICBhZGQoZWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMucHVzaChlbGVtZW50KVxyXG4gICAgICAgIGVsZW1lbnQuc2V0SWQodGhpcy5sZW5ndGggLSAxKSBcclxuICAgIH1cclxuXHJcbiAgICBnZXQoaSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzW2ldXHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlKGkpIHtcclxuICAgICAgICAvL3RoaXMuc3BsaWNlKGksIDEpXHJcbiAgICAgICAgdGhpc1tpXSA9IG51bGxcclxuICAgICAgICAvL8OEbmRlcnVuZyB2b24gQnJpYW5cclxuICAgICAgIFxyXG5cclxuICAgIH1cclxuXHJcbiAgICBkcmF3KGN0eCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzW2ldICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXNbaV0uZHJhdyhjdHgpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHsgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXNbaV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpc1tpXS5hY3Rpb24oKVxyXG4gICAgICAgICAgICAgICAgLy8gTkVVOiBCdWxsZXQgdW5kIFdvcmQgY2xlYW51cFxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXNbaV0uaGFzQ29sbGlkZWQgfHwgdGhpc1tpXS5kZXN0cm95ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGljZShpLCAxKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrQ29sbGlzaW9uKCkgeyBcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYodGhpc1tpXSAhPSBudWxsICYmICF0aGlzW2ldLmhhc0NvbGxpZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzW2ldLmNoZWNrQ29sbGlzaW9uKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKVxyXG5jb25zdCBSYW5kb21XYWxrQ2lyY2xlRWxlbWVudCA9IHJlcXVpcmUoJy4vcmFuZG9td2Fsa2NpcmNsZWVsZW1lbnQnKVxyXG5jb25zdCBFbGVtZW50TGlzdCA9IHJlcXVpcmUoJy4vZWxlbWVudGxpc3QnKVxyXG5jb25zdCBTdGFnZSA9IHJlcXVpcmUoJy4vc3RhZ2UnKVxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZShcIi4vd29yZFwiKVxyXG5jb25zdCBWYWxpZGF0b3IgPSByZXF1aXJlKCcuL3ZhbGlkYXRvcicpXHJcbmNvbnN0IFdvcmRJbnB1dEhhbmRsZXIgPSByZXF1aXJlKCcuL3dvcmRpbnB1dGhhbmRsZXInKVxyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgR2FtZSB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5yYWYgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlcXVlc3QgYW5pbWF0aW9uIGZyYW1lIGhhbmRsZVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBudWxsXHJcbiAgICAgICAgdGhpcy5zY29yZSA9IDAgXHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgPSAnJ1xyXG4gICAgICAgIC8vIMOEbmRlcnVuZ2VuIHZvbiBCcmlhblxyXG4gICAgICAgIHRoaXMudmFsaWRhdG9yID0gbmV3IFZhbGlkYXRvcigpO1xyXG4gICAgICAgIHRoaXMud29yZElucHV0aGFuZGVyID0gbmV3IFdvcmRJbnB1dEhhbmRsZXIoKTtcclxuICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICB0aGlzLndvcmRJbnB1dGhhbmRlci5zZXRMZXR0ZXJDYWxsYmFjayh0aGlzLmhhbmRsZUxldHRlcklucHV0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdCA9IG5ldyBFbGVtZW50TGlzdCgpXHJcbiAgICAgICAgLy90aGlzLnNldHVwSW5wdXQoKVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QuYWRkKG5ldyBTdGFnZSgpKTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDYwOyBpKyspIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IFJhbmRvbVdhbGtDaXJjbGVFbGVtZW50KHRoaXMpKTtcclxuICAgICAgICAgICAgfSwgMzAwMCAqIGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgU3RhZ2UoKSlcclxuXHJcbiAgICAgICAgdGhpcy50aW1lT2ZMYXN0RnJhbWUgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgdGhpcy5yYWYgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMudGljay5iaW5kKHRoaXMpKVxyXG4gICAgfVxyXG5cclxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuICAgIHN0b3AoKSB7XHJcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMucmFmKVxyXG4gICAgICAgIHRoaXMuZWxlbWVudExpc3QgPSBudWxsXHJcbiAgICB9XHJcblxyXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICBsZXQgbXljYW52YXMgPSB3aW5kb3cuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJteWNhbnZhc1wiKVxyXG4gICAgICAgIGxldCBjdHggPSBteWNhbnZhcy5nZXRDb250ZXh0KCcyZCcpXHJcbiAgICAgICAgY3R4LmZvbnQgPSBcIjE4cHggQXJpYWxcIjtcclxuXHJcbiAgICAgICAgXHJcbiAgICBcclxuICAgICAgICBcclxuICAgICAgICAvLy0tLSBjbGVhciBzY3JlZW5cclxuICAgICAgICBjdHguZmlsbFN0eWxlID0gJ3JnYmEoMjM1LCAyNTAsIDI1NSwgMC4xKScgLy8gYWxwaGEgPCAxIGzDtnNjaHQgZGVuIEJpbGRzY2hyaW0gbnVyIHRlaWx3ZWlzZSAtPiBiZXdlZ3RlIEdlZ2Vuc3TDpG5kZSBlcnpldWdlbiBTcHVyZW5cclxuICAgICAgICBjdHguZmlsbFJlY3QoMCwgMCwgbXljYW52YXMuY2xpZW50V2lkdGgsIG15Y2FudmFzLmNsaWVudEhlaWdodClcclxuXHJcbiAgICAgICAgLy/DhG5kZXJ1bmdlbiB2b24gQnJpYW4gKHRlc3QpXHJcbiAgICAgICAgIFxyXG5cclxuICAgICAgICAvLy0tLSBkcmF3IGVsZW1lbnRzXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5kcmF3KGN0eClcclxuXHJcbiAgICAgICAgLy8tLS0gZXhlY3V0ZSBlbGVtZW5TdCBhY3Rpb25zXHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hY3Rpb24oKVxyXG5cclxuICAgICAgICAvLy0tLSBjaGVjayBlbGVtZW50IGNvbGxpc2lvbnNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmNoZWNrQ29sbGlzaW9uKClcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVVSSgpXHJcblxyXG4gICAgICAgIHRoaXMucmFmID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnRpY2suYmluZCh0aGlzKSlcclxuXHJcbiAgICAgICBcclxuICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBcclxuICAgIFxyXG5cclxuXHJcbiAgICBpc1dvcmRPbkRpc3BsYXkod29yZCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZih0aGlzLmVsZW1lbnRMaXN0W2ldICE9IG51bGwgJiYgdGhpcy5lbGVtZW50TGlzdFtpXSBpbnN0YW5jZW9mIFdvcmQgJiYgdGhpcy5lbGVtZW50TGlzdFtpXS53b3JkLmNoYXJBdCgwKSA9PSB3b3JkLmNoYXJBdCgwKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8qc2V0dXBJbnB1dCgpIHtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGUpID0+IHtcclxuICAgICAgICAgICAgaWYgKGUua2V5ID09PSAnRW50ZXInKSB0aGlzLnNob290VG9DaXJjbGUoKVxyXG4gICAgICAgICAgICBlbHNlIGlmIChlLmtleSA9PT0gJ0JhY2tzcGFjZScpIHRoaXMuY3VycmVudElucHV0ID0gdGhpcy5jdXJyZW50SW5wdXQuc2xpY2UoMCwgLTEpXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKC9bYS16QS1aXS8udGVzdChlLmtleSkpIHRoaXMuY3VycmVudElucHV0ICs9IGUua2V5LnRvTG93ZXJDYXNlKClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVVSSgpXHJcbiAgICAgICAgfSlcclxuICAgIH0qL1xyXG5cclxuICAgIC8qc2hvb3RUb0NpcmNsZSgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuY3VycmVudElucHV0KSByZXR1cm5jYWJsZVxyXG4gICAgXHJcbiAgICAgICAgLy8gRmluZGUgZGFzIFdPUlQgaW4gZGVyIGVsZW1lbnRMaXN0XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0V29yZCA9IHRoaXMuZWxlbWVudExpc3QuZmluZChlbCA9PiBcclxuICAgICAgICAgICAgZWwgaW5zdGFuY2VvZiBXb3JkICYmICFlbC5oYXNDb2xsaWRlZCAmJiBlbC53b3JkID09PSB0aGlzLmdldEN1cnJlbnRXb3JkKClcclxuICAgICAgICApXHJcbiAgICBcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXRXb3JkKSByZXR1cm5cclxuICAgIFxyXG4gICAgICAgIC8vIERpZSBCdWxsZXQgZmxpZWd0IHp1bSBDSVJDTEUtRUxFTUVOVCAobmljaHQgenVtIFdvcnQpXHJcbiAgICAgICAgLy8gdGFyZ2V0V29yZC5jaXJjbGVJZCBpc3QgZGllIGluc3RhbmNlSWQgZGVzIEtyZWlzZXNcclxuICAgICAgICB0aGlzLmVsZW1lbnRMaXN0LmFkZChuZXcgQnVsbGV0KFxyXG4gICAgICAgICAgICB0YXJnZXRXb3JkLngsICAgICAgICAgICAvLyBaSUVMIFggZGVzIEtyZWlzZXNcclxuICAgICAgICAgICAgdGFyZ2V0V29yZC55LCAgICAgICAgICAgLy8gWklFTCBZIGRlcyBLcmVpc2VzXHJcbiAgICAgICAgICAgIHRhcmdldFdvcmQuY2lyY2xlSWQsICAgIC8vIFRhcmdldCBpc3QgZGVyIEtSRUlTXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApKVxyXG4gICAgICAgIHRoaXMuY3VycmVudElucHV0ID0gJydcclxuICAgIH0qL1xyXG5cclxuICAgIGdldEN1cnJlbnRXb3JkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRJbnB1dFxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVVJKCkge1xyXG4gICAgICAgIGNvbnN0IGVsID0gaWQgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpXHJcbiAgICAgICAgaWYgKGVsKCdjdXJyZW50LWlucHV0JykpIGVsKCdjdXJyZW50LWlucHV0JykudGV4dENvbnRlbnQgPSB0aGlzLmdldEN1cnJlbnRXb3JkKClcclxuICAgICAgICBpZiAoZWwoJ3Njb3JlJykpIGVsKCdzY29yZScpLnRleHRDb250ZW50ID0gdGhpcy5zY29yZVxyXG4gICAgfVxyXG4gICAgXHJcblxyXG5oYW5kbGVMZXR0ZXJJbnB1dChsZXR0ZXIpIHtcclxuICAgIC8vIFdlbm4ga2VpbiBXb3J0IGFrdGl2IGlzdCwgc3VjaGUgZWluIG5ldWVzXHJcbiAgICBpZiAoIXRoaXMuYWN0aXZlV29yZEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmZpbmROZXdXb3JkKGxldHRlcik7XHJcbiAgICB9IFxyXG4gICAgLy8gV2VubiBXb3J0IGFrdGl2IGlzdCwgdGlwcGUgd2VpdGVyXHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0aGlzLmNvbnRpbnVlVHlwaW5nV29yZChsZXR0ZXIpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBTdWNodCBlaW4gbmV1ZXMgV29ydCBiYXNpZXJlbmQgYXVmIGVyc3RlbSBCdWNoc3RhYmVuXHJcbmZpbmROZXdXb3JkKGZpcnN0TGV0dGVyKSB7XHJcbiAgICBcclxuICAgIGNvbnN0IGFjdGl2ZVdvcmRzID0gW107XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZWxlbWVudExpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudExpc3RbaV07XHJcbiAgICAgICAgaWYgKGVsIGluc3RhbmNlb2YgV29yZCAmJiAhZWwuaGFzQ29sbGlkZWQpIHtcclxuICAgICAgICAgICAgYWN0aXZlV29yZHMucHVzaChlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvLyBGaW5kZSBkYXMgRVJTVEUgV29ydCBkYXMgbWl0IGRlbSBCdWNoc3RhYmVuIGJlZ2lubnRcclxuICAgIGNvbnN0IG1hdGNoaW5nV29yZCA9IGFjdGl2ZVdvcmRzLmZpbmQod29yZCA9PiBcclxuICAgICAgICB3b3JkLndvcmQudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKGZpcnN0TGV0dGVyKVxyXG4gICAgKTtcclxuICAgIFxyXG4gICAgaWYgKG1hdGNoaW5nV29yZCkge1xyXG4gICAgICAgIHRoaXMuYWN0aXZlV29yZEVsZW1lbnQgPSBtYXRjaGluZ1dvcmQ7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgPSBmaXJzdExldHRlcjtcclxuICAgICAgICBcclxuICAgIH1cclxufVxyXG5cclxuICAgIC8vIFRpcHBlIGFtIGFrdGl2ZW4gV29ydCB3ZWl0ZXJcclxuICAgIGNvbnRpbnVlVHlwaW5nV29yZChsZXR0ZXIpIHtcclxuICAgICAgICBjb25zdCBleHBlY3RlZE5leHRMZXR0ZXIgPSB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LndvcmQudG9Mb3dlckNhc2UoKVt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG4gICAgXHJcbiAgICAgICAgLy8gUHLDvGZlIG9iIGRlciBCdWNoc3RhYmUga29ycmVrdCBpc3RcclxuICAgICAgICBpZiAobGV0dGVyID09PSBleHBlY3RlZE5leHRMZXR0ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50SW5wdXQgKz0gbGV0dGVyO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBQcsO8ZmUgb2IgV29ydCB2b2xsc3TDpG5kaWdcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudElucHV0ID09PSB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LndvcmQudG9Mb3dlckNhc2UoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbldvcmRDb21wbGV0ZWQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gRmFsc2NoZXIgQnVjaHN0YWJlIC0gUmVzZXRcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXRBY3RpdmVXb3JkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBXb3J0IGVyZm9sZ3JlaWNoIGFiZ2V0aXBwdFxyXG4gICAgb25Xb3JkQ29tcGxldGVkKCkge1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIEt1Z2VsIGF1ZiBkZW4gS3JlaXMgc2NoaWXDn2VuXHJcbiAgICAgICAgY29uc3QgdGFyZ2V0Q2lyY2xlID0gdGhpcy5lbGVtZW50TGlzdC5nZXQodGhpcy5hY3RpdmVXb3JkRWxlbWVudC5jaXJjbGVJZCk7XHJcbiAgICBpZiAodGFyZ2V0Q2lyY2xlKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50TGlzdC5hZGQobmV3IEJ1bGxldChcclxuICAgICAgICAgICAgdGFyZ2V0Q2lyY2xlLngsXHJcbiAgICAgICAgICAgIHRhcmdldENpcmNsZS55LFxyXG4gICAgICAgICAgICB0aGlzLmFjdGl2ZVdvcmRFbGVtZW50LmNpcmNsZUlkLHRoaXMpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgXHJcbiAgICB0aGlzLnJlc2V0QWN0aXZlV29yZCgpO1xyXG4gICAgfVxyXG5cclxuLy8gQWt0aXZlcyBXb3J0IHp1csO8Y2tzZXR6ZW5cclxucmVzZXRBY3RpdmVXb3JkKCkge1xyXG4gICAgdGhpcy5hY3RpdmVXb3JkRWxlbWVudCA9IG51bGw7XHJcbiAgICB0aGlzLmN1cnJlbnRJbnB1dCA9ICcnO1xyXG59XHJcblxyXG4vLyBQcsO8ZmUgaW4gamVkZW0gRnJhbWUgb2IgYWt0aXZlcyBXb3J0IG5vY2ggZXhpc3RpZXJ0XHJcbmNoZWNrQWN0aXZlV29yZFZhbGlkaXR5KCkge1xyXG4gICAgaWYgKHRoaXMuYWN0aXZlV29yZEVsZW1lbnQpIHtcclxuICAgICAgICBsZXQgd29yZFN0aWxsRXhpc3RzID0gZmFsc2U7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gRHVyY2hzdWNoZSBkaWUgRWxlbWVudExpc3QgbWFudWVsbFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbGVtZW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBlbCA9IHRoaXMuZWxlbWVudExpc3RbaV07XHJcbiAgICAgICAgICAgIGlmIChlbCA9PT0gdGhpcy5hY3RpdmVXb3JkRWxlbWVudCAmJiAhZWwuaGFzQ29sbGlkZWQpIHtcclxuICAgICAgICAgICAgICAgIHdvcmRTdGlsbEV4aXN0cyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBpZiAoIXdvcmRTdGlsbEV4aXN0cykge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5yZXNldEFjdGl2ZVdvcmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxufVxyXG4iLCJcInVzZSBzdHJpY3RcIlxyXG4gXHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKFwiLi9nYW1lXCIpXHJcbmxldCBteUdhbWUgPSBuZXcgR2FtZSgpXHJcbm15R2FtZS5zdGFydCgpIiwiXCJ1c2Ugc3RyaWN0XCJcclxuXHJcbmNvbnN0IEVsZW1lbnQgPSByZXF1aXJlKCcuL2VsZW1lbnQnKVxyXG5jb25zdCBCdXJzdCA9IHJlcXVpcmUoJy4vYnVyc3QnKVxyXG5jb25zdCBXb3JkID0gcmVxdWlyZSgnLi93b3JkJylcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUmFuZG9tV2Fsa0NpcmNsZUVsZW1lbnQgZXh0ZW5kcyBFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUpIHtcclxuICAgICAgICBzdXBlcigpXHJcbiAgICAgICAgdGhpcy5nYW1lID0gZ2FtZVxyXG4gICAgICAgIHRoaXMueCA9IE1hdGgucmFuZG9tKCkgKiA1MzAgKyA0MFxyXG4gICAgICAgIHRoaXMueSA9IDBcclxuICAgICAgICB0aGlzLnNwZWVkID0gMC43XHJcbiAgICAgICAgXHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IFxyXG4gICAgICAgICAgICBsZXQgd29yZCA9IG5ldyBXb3JkKHRoaXMuZ2FtZSwgdGhpcy54LCB0aGlzLnksIHRoaXMuaW5zdGFuY2VJZCwgdGhpcy5zcGVlZClcclxuICAgICAgICAgICAgdGhpcy5nYW1lLmVsZW1lbnRMaXN0LmFkZCh3b3JkKVxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICAgICAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgICAgICAgICAgIGN0eC5hcmModGhpcy54LCB0aGlzLnksIDE1LCAwLCBNYXRoLlBJICogMiwgdHJ1ZSlcclxuICAgICAgICAgICAgY3R4LmNsb3NlUGF0aCgpXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjdHguZmlsbFN0eWxlID0gIFwiZ3JleVwiXHJcbiAgICAgICAgICAgIGN0eC5maWxsKClcclxuXHJcbiAgICB9XHJcblxyXG4gICAgY2FsbEJ1cnN0KCkge1xyXG4gICAgICAgIHZhciBidXJzdCA9IG5ldyBCdXJzdCh0aGlzLngsIHRoaXMueSwgdGhpcy5nYW1lKVxyXG4gICAgICAgIHRoaXMuZ2FtZS5lbGVtZW50TGlzdC5hZGQoYnVyc3QpXHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIC8vdGhpcy54ICs9IE1hdGgucmFuZG9tKCkgKiAyIC0gMVxyXG4gICAgICAgIHRoaXMueSArPSB0aGlzLnNwZWVkXHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tDb2xsaXNpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMueSA+IDU1MCAmJiB0aGlzLnkgPD0gNTUwICsgdGhpcy5zcGVlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZCk7XHJcbiAgICAgICAgdGhpcy5jYWxsQnVyc3QoKVxyXG4gICAgfVxyXG4gICAgXHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFN0YWdlIGV4dGVuZHMgRWxlbWVudCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKVxyXG4gICAgICAgIHRoaXMueCA9IDBcclxuICAgICAgICB0aGlzLnkgPSAwXHJcbiAgICB9XHJcblxyXG4gICAgZHJhdyhjdHgpIHtcclxuICAgICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjdHguZHJhd0ltYWdlKGltZywgMCwgMCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBpbWcuc3JjID0gJ2ltZy9iYWNrZ3JvdW5kLnBuZyc7XHJcbiAgICB9XHJcblxyXG4gICAgYWN0aW9uKCkge1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG59IiwibW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBWYWxpZGF0b3Ige1xyXG5cclxuY29uc3RydWN0b3IoKXtcclxuICB0aGlzLmFjdGl2ZVdvcmQgPSBcIlwiO1xyXG4gIHRoaXMuY3VycmVudElucHV0ID0gXCJcIjtcclxuICAvL3RoaXMuY3VycmVudFNwb3Q9MDtcclxuICAvL3RoaXMud29yZExvY2tlZCA9IGZhbHNlO1xyXG59XHJcblxyXG5cclxuXHJcbnNldEFjdGl2ZVdvcmQod29yZCl7XHJcbiAgICB0aGlzLmFjdGl2ZVdvcmQgPSB3b3JkLnRvTG93ZXJDYXNlKCk7XHJcbiAgICB0aGlzLmN1cnJlbnRJbnB1dCA9IFwiXCJcclxuICAgIC8vdGhpcy53b3JkTG9ja2VkID0gZmFsc2U7XHJcbiAgICAvL3RoaXMuY3VycmVudFNwb3QgPSAwO1xyXG59XHJcblxyXG5jaGVja0xldHRlcihsZXR0ZXIpe1xyXG4gICAgLy9jb25zdCBleHBlY3RlZENoYXIgPSB0aGlzLnRhcmdldFdvcmRbdGhpcy5jdXJyZW50U3BvdF07XHJcbiAgICBpZigvKiF0aGlzLndvcmRMb2NrZWQgfHwqLyAhdGhpcy5hY3RpdmVXb3JkKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV4cGVjdGVkQ2hhciA9IHRoaXMuYWN0aXZlV29yZFt0aGlzLmN1cnJlbnRJbnB1dC5sZW5ndGhdO1xyXG5cclxuICAgIGlmKGxldHRlciA9PT0gZXhwZWN0ZWRDaGFyKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnRJbnB1dCArPSBsZXR0ZXI7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcblxyXG5cclxufVxyXG5cclxuXHJcbmlzV29yZENvbXBsZXRlKCl7XHJcbiAgICByZXR1cm4gdGhpcy5hY3RpdmVXb3JkICYmIHRoaXMuY3VycmVudElucHV0ID09PSB0aGlzLmFjdGl2ZVdvcmQ7XHJcbn1cclxuZ2V0QWN0aXZlV29yZCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlV29yZDtcclxufVxyXG5yZXNldCgpe1xyXG4gICAgdGhpcy5jdXJyZW50SW5wdXQgPSBcIlwiO1xyXG4gICAgdGhpcy5hY3RpdmVXb3JkID0gbnVsbDtcclxuICAgIC8vdGhpcy53b3JkTG9ja2VkID0gZmFsc2U7XHJcbn1cclxuXHJcbmdldEN1cnJlbnRJbnB1dCgpe1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudElucHV0O1xyXG59XHJcbmhhc0FjdGl2ZVdvcmQoKXtcclxuICAgIHJldHVybiB0aGlzLmFjdGl2ZVdvcmQgIT09IFwiXCI7XHJcbn1cclxuXHJcbn0iLCJcInVzZSBzdHJpY3RcIlxyXG5cclxuY29uc3QgRWxlbWVudCA9IHJlcXVpcmUoJy4vZWxlbWVudCcpXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFdvcmQgZXh0ZW5kcyBFbGVtZW50IHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWUsIHgsIHksIGNpcmNsZUlkLCBzcGVlZCkge1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlIFxyXG4gICAgICAgIHRoaXMuZ2FtZSA9IGdhbWVcclxuICAgICAgICB0aGlzLmNpcmNsZUlkID0gY2lyY2xlSWRcclxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWRcclxuICAgICAgICBjb25zdCB3b3JkTGlzdCA9IFsnUm9jaycsJ1BhcGVyJywnU2Npc3NvcicsJ0FwcGxlJywnT3JhbmdlJywnQmFuYW5hJywnR3JhcGUnLCdNYW5nbycsJ0xlbW9uJywnTGltZScsJ0NoZXJyeScsJ1BlYXInLCdQZWFjaCcsJ1BsdW0nLCdBcHJpY290JywnRmlnJywnRGF0ZScsJ0tpd2knLCdNZWxvbicsJ0JlcnJ5JywnU3RyYXcnLCdTdG9uZScsJ1dhdGVyJywnRmlyZScsJ0VhcnRoJywnV2luZCcsJ1NreScsJ0Nsb3VkJywnUmFpbicsJ1N0b3JtJywnVGh1bmRlcicsJ0xpZ2h0bmluZycsJ1JpdmVyJywnT2NlYW4nLCdTZWEnLCdMYWtlJywnUG9uZCcsJ1N0cmVhbScsJ0hpbGwnLCdNb3VudGFpbicsJ1ZhbGxleScsJ0ZvcmVzdCcsJ1dvb2RzJywnSnVuZ2xlJywnRGVzZXJ0JywnSXNsYW5kJywnQ29hc3QnLCdTaG9yZScsJ0JlYWNoJywnU2FuZCcsJ0RpcnQnLCdTb2lsJywnR3Jhc3MnLCdMZWFmJywnVHJlZScsJ0JyYW5jaCcsJ1Jvb3QnLCdGbG93ZXInLCdQZXRhbCcsJ1NlZWQnLCdQbGFudCcsJ0hlcmInLCdWaW5lJywnQmFyaycsJ1N0ZW0nLCdNb3NzJywnRnVuZ2knLCdNdXNocm9vbScsJ0FuaW1hbCcsJ0JpcmQnLCdGaXNoJywnSW5zZWN0JywnQmVhc3QnLCdDcmVhdHVyZScsJ0h1bWFuJywnUGVyc29uJywnQ2hpbGQnLCdBZHVsdCcsJ01hbicsJ1dvbWFuJywnQm95JywnR2lybCcsJ0ZyaWVuZCcsJ05laWdoYm9yJywnRG9jdG9yJywnVGVhY2hlcicsJ1N0dWRlbnQnLCdQaWxvdCcsJ0RyaXZlcicsJ0Zhcm1lcicsJ0h1bnRlcicsJ1NpbmdlcicsJ0RhbmNlcicsJ0FydGlzdCcsJ1dyaXRlcicsJ1JlYWRlcicsJ0xlYWRlcicsJ1dvcmtlcicsJ0J1aWxkZXInLCdNYWtlcicsJ0Nvb2snLCdCYWtlcicsJ1NvbGRpZXInLCdPZmZpY2VyJywnR3VhcmQnLCdLaW5nJywnUXVlZW4nLCdQcmluY2UnLCdQcmluY2VzcycsJ0tuaWdodCcsJ1dpemFyZCcsJ0hlcm8nLCdHaWFudCcsJ0R3YXJmJywnUm9ib3QnLCdBbGllbicsJ01vbnN0ZXInLCdBbmdlbCcsJ0RlbW9uJywnU3Bpcml0JywnR2hvc3QnLCdTaGFkb3cnLCdMaWdodCcsJ0RhcmsnLCdCcmlnaHQnLCdEaW0nLCdTaGFycCcsJ0JsdW50JywnU29mdCcsJ0hhcmQnLCdTdHJvbmcnLCdXZWFrJywnUXVpY2snLCdTbG93JywnRmFzdCcsJ0hlYXZ5JywnTGlnaHR3ZWlnaHQnLCdTbWFsbCcsJ0xhcmdlJywnSHVnZScsJ1RpbnknLCdTaG9ydCcsJ1RhbGwnLCdXaWRlJywnTmFycm93JywnRGVlcCcsJ1NoYWxsb3cnLCdOZXcnLCdPbGQnLCdZb3VuZycsJ0FuY2llbnQnLCdGcmVzaCcsJ1N0YWxlJywnSG90JywnQ29sZCcsJ1dhcm0nLCdDb29sJywnRHJ5JywnV2V0JywnQ2xlYW4nLCdEaXJ0eScsJ1N3ZWV0JywnU291cicsJ0JpdHRlcicsJ1NhbHR5JywnU3BpY3knLCdQbGFpbicsJ0hhcHB5JywnU2FkJywnQW5ncnknLCdDYWxtJywnQnJhdmUnLCdTaHknLCdQb2xpdGUnLCdSdWRlJywnS2luZCcsJ01lYW4nLCdTbWFydCcsJ0R1bGwnLCdDbGV2ZXInLCdXaXNlJywnU2lsbHknLCdGdW5ueScsJ1NlcmlvdXMnLCdSZWFkeScsJ0Jhc2ljJywnU2ltcGxlJywnQ29tcGxleCcsJ0RpZmZpY3VsdCcsJ0Vhc3knLCdQb3NzaWJsZScsJ0NlcnRhaW4nLCdSYW5kb20nLCdDb21tb24nLCdSYXJlJywnRmFtb3VzJywnVW5rbm93bicsJ0VtcHR5JywnRnVsbCcsJ09wZW4nLCdDbG9zZWQnLCdFYXJseScsJ0xhdGUnLCdGaXJzdCcsJ0xhc3QnLCdSaWdodCcsJ0xlZnQnLCdOb3J0aCcsJ1NvdXRoJywnRWFzdCcsJ1dlc3QnLCdJbnNpZGUnLCdPdXRzaWRlJywnQWJvdmUnLCdCZWxvdycsJ0Zyb250JywnQmFjaycsJ05lYXInLCdGYXInLCdIZXJlJywnVGhlcmUnLCdFdmVyeXdoZXJlJywnU29tZXdoZXJlJywnTm93aGVyZScsJ0Fsd2F5cycsJ05ldmVyJywnU29tZXRpbWVzJywnT2Z0ZW4nLCdTZWxkb20nLCdEYWlseScsJ1dlZWtseScsJ01vbnRobHknLCdZZWFybHknLCdNb21lbnQnLCdTZWNvbmQnLCdNaW51dGUnLCdIb3VyJywnRGF5JywnV2VlaycsJ01vbnRoJywnWWVhcicsJ0RlY2FkZScsJ0NlbnR1cnknLCdUaW1lJywnQ2xvY2snLCdXYXRjaCcsJ01vcm5pbmcnLCdOb29uJywnRXZlbmluZycsJ05pZ2h0JywnTWlkbmlnaHQnLCdTdW4nLCdNb29uJywnU3RhcicsJ1BsYW5ldCcsJ1dvcmxkJywnVW5pdmVyc2UnLCdHYWxheHknLCdTcGFjZScsJ1ZvaWQnLCdFbmVyZ3knLCdQb3dlcicsJ0ZvcmNlJywnTW90aW9uJywnU3BlZWQnLCdHcmF2aXR5JywnQXRvbScsJ0NlbGwnLCdNYXR0ZXInLCdPYmplY3QnLCdJdGVtJywnVGhpbmcnLCdUb29sJywnRGV2aWNlJywnTWFjaGluZScsJ0VuZ2luZScsJ01vdG9yJywnQ2FyJywnVHJ1Y2snLCdCdXMnLCdUcmFpbicsJ1BsYW5lJywnQm9hdCcsJ1NoaXAnLCdCaWtlJywnQ3ljbGUnLCdXaGVlbCcsJ1JvYWQnLCdQYXRoJywnVHJhaWwnLCdCcmlkZ2UnLCdUdW5uZWwnLCdUb3dlcicsJ0hvdXNlJywnSG9tZScsJ1Jvb20nLCdEb29yJywnV2luZG93JywnV2FsbCcsJ0Zsb29yJywnQ2VpbGluZycsJ1Jvb2YnLCdIYWxsJywnR2FyZGVuJywnWWFyZCcsJ0Zhcm0nLCdCYXJuJywnTWFya2V0JywnU3RvcmUnLCdTaG9wJywnTWFsbCcsJ0xpYnJhcnknLCdTY2hvb2wnLCdPZmZpY2UnLCdGYWN0b3J5JywnQ2h1cmNoJywnVGVtcGxlJywnQ2FzdGxlJywnUGFsYWNlJywnVmlsbGFnZScsJ1Rvd24nLCdDaXR5JywnQ291bnRyeScsJ05hdGlvbicsJ0tpbmdkb20nLCdFbXBpcmUnLCdBcm15JywnTmF2eScsJ1BvbGljZScsJ0NvdXJ0JywnTGF3JywnSnVkZ2UnLCdDcmltZScsJ0p1cnknLCdUcmlhbCcsJ01vbmV5JywnQ2FzaCcsJ0NvaW4nLCdDcmVkaXQnLCdEZWJpdCcsJ0JhbmsnLCdWYWx1ZScsJ1ByaWNlJywnQ29zdCcsJ1RyYWRlJywnU2FsZScsJ1N0b3JlJywnQnV5ZXInLCdTZWxsZXInLCdHaWZ0JywnUHJlc2VudCcsJ1ByaXplJywnUmV3YXJkJywnVHJlYXN1cmUnLCdHb2xkJywnU2lsdmVyJywnQ29wcGVyJywnSXJvbicsJ1N0ZWVsJywnU3RvbmUnLCdCcmljaycsJ1dvb2QnLCdQYXBlcicsJ0Nsb3RoJywnTGVhdGhlcicsJ0dsYXNzJywnUGxhc3RpYycsJ1J1YmJlcicsJ1N0cmluZycsJ1JvcGUnLCdDaGFpbicsJ0JsYWRlJywnU3dvcmQnLCdLbmlmZScsJ0F4ZScsJ0hhbW1lcicsJ1dyZW5jaCcsJ1NjcmV3JywnTmFpbCcsJ0JvbHQnLCdEcmlsbCcsJ1NhdycsJ0JydXNoJywnUGFpbnQnLCdDb2xvcicsJ0luaycsJ1BlbicsJ1BlbmNpbCcsJ01hcmtlcicsJ0Jvb2snLCdQYWdlJywnU3RvcnknLCdQb2VtJywnU29uZycsJ011c2ljJywnU291bmQnLCdOb2lzZScsJ1ZvaWNlJywnV29yZCcsJ0xldHRlcicsJ1BocmFzZScsJ1NlbnRlbmNlJywnTGluZScsJ1BhcmFncmFwaCcsJ05vdmVsJywnRHJhbWEnLCdDb21lZHknLCdUcmFnZWR5JywnTW92aWUnLCdGaWxtJywnU2NlbmUnLCdBY3RvcicsJ1N0YWdlJywnU2NyZWVuJywnSW1hZ2UnLCdQaWN0dXJlJywnUGhvdG8nLCdWaWRlbycsJ0NhbWVyYScsJ0xpZ2h0JywnTGFtcCcsJ0NhbmRsZScsJ0ZpcmVwbGFjZScsJ092ZW4nLCdTdG92ZScsJ0ZyaWRnZScsJ1RhYmxlJywnQ2hhaXInLCdEZXNrJywnQmVkJywnQ291Y2gnLCdTb2ZhJywnU2hlbGYnLCdDYWJpbmV0JywnTWlycm9yJywnQ2xvY2snLCdCYWcnLCdCb3gnLCdCb3R0bGUnLCdDdXAnLCdHbGFzcycsJ1BsYXRlJywnQm93bCcsJ0ZvcmsnLCdTcG9vbicsJ0tuaWZlJywnTWVhbCcsJ0Zvb2QnLCdEcmluaycsJ0JyZWFkJywnUmljZScsJ01lYXQnLCdGaXNoJywnRWdnJywnTWlsaycsJ0NoZWVzZScsJ0J1dHRlcicsJ1N1Z2FyJywnU2FsdCcsJ1BlcHBlcicsJ1NwaWNlJywnU291cCcsJ1N0ZXcnLCdTYXVjZScsJ0ZydWl0JywnVmVnZXRhYmxlJywnQ2Fycm90JywnUG90YXRvJywnVG9tYXRvJywnT25pb24nLCdHYXJsaWMnLCdQZXBwZXInLCdDb3JuJywnQmVhbicsJ1BlYScsJ1NwaW5hY2gnLCdCcm9jY29saScsJ0NhYmJhZ2UnLCdMZXR0dWNlJywnVGVhJywnQ29mZmVlJywnSnVpY2UnLCdXYXRlcicsJ1NvZGEnLCdXaW5lJywnQmVlcicsJ0JyZWFrZmFzdCcsJ0x1bmNoJywnRGlubmVyJywnU25hY2snLCdGZWFzdCcsJ1BhcnR5JywnR2FtZScsJ1Nwb3J0JywnTWF0Y2gnLCdXaW4nLCdMb3NzJywnU2NvcmUnLCdHb2FsJywnUG9pbnQnLCdUZWFtJywnUGxheWVyJywnQ29hY2gnLCdKdWRnZScsJ1JlZmVyZWUnLCdSYWNlJywnUnVuJywnV2FsaycsJ0p1bXAnLCdTd2ltJywnQ2xpbWInLCdUaHJvdycsJ0NhdGNoJywnSGl0JywnS2ljaycsJ1B1c2gnLCdQdWxsJywnTGlmdCcsJ0Ryb3AnLCdIb2xkJywnVG91Y2gnLCdMb29rJywnU2VlJywnSGVhcicsJ0xpc3RlbicsJ1NwZWFrJywnVGFsaycsJ1NheScsJ1RlbGwnLCdXcml0ZScsJ1JlYWQnLCdUaGluaycsJ0tub3cnLCdMZWFybicsJ1RlYWNoJywnVW5kZXJzdGFuZCcsJ0JlbGlldmUnLCdJbWFnaW5lJywnUmVtZW1iZXInLCdGb3JnZXQnLCdMb3ZlJywnSGF0ZScsJ0ZlYXInLCdIb3BlJywnRHJlYW0nLCdTbGVlcCcsJ1dha2UnLCdMaXZlJywnRGllJywnR3JvdycsJ1NocmluaycsJ0NoYW5nZScsJ1N0YXknLCdNb3ZlJywnVHJhdmVsJywnVmlzaXQnLCdFeHBsb3JlJywnU2VhcmNoJywnRmluZCcsJ0xvc2UnLCdCdWlsZCcsJ0JyZWFrJywnRml4JywnQ3JlYXRlJywnRGVzdHJveScsJ09wZW4nLCdDbG9zZScsJ1N0YXJ0JywnU3RvcCcsJ0JlZ2luJywnRW5kJywnQ29udGludWUnLCdSZXR1cm4nLCdGb2xsb3cnLCdMZWFkJywnU3VwcG9ydCcsJ0hlbHAnLCdTYXZlJywnUHJvdGVjdCcsJ0F0dGFjaycsJ0RlZmVuZCcsJ0pvaW4nLCdMZWF2ZScsJ0VudGVyJywnRXhpdCcsJ0Nsb3RoJywnU2hpcnQnLCdQYW50cycsJ0RyZXNzJywnU2tpcnQnLCdDb2F0JywnSGF0JywnQm9vdCcsJ1Nob2UnLCdTb2NrJywnR2xvdmUnLCdCZWx0JywnUmluZycsJ05lY2tsYWNlJywnQnJhY2VsZXQnLCdXYXRjaCcsJ1dhbGxldCcsJ1B1cnNlJywnUGhvbmUnLCdUYWJsZXQnLCdMYXB0b3AnLCdDb21wdXRlcicsJ0tleWJvYXJkJywnTW91c2UnLCdTY3JlZW4nLCdNb25pdG9yJywnQ2FibGUnLCdXaXJlJywnU2lnbmFsJywnTmV0d29yaycsJ1dlYnNpdGUnLCdJbnRlcm5ldCcsJ1NvZnR3YXJlJywnUHJvZ3JhbScsJ0ZpbGUnLCdGb2xkZXInLCdEYXRhJywnQ29kZScsJ0Vycm9yJywnU3lzdGVtJywnTG9naWMnLCdNZXRob2QnLCdUaGVvcnknLCdNb2RlbCcsJ1BhdHRlcm4nLCdTdHJ1Y3R1cmUnLCdTaGFwZScsJ0Zvcm0nLCdDaXJjbGUnLCdTcXVhcmUnLCdUcmlhbmdsZScsJ0N1YmUnLCdTcGhlcmUnLCdMaW5lJywnUG9pbnQnLCdBbmdsZScsJ0N1cnZlJywnRWRnZScsJ1NpZGUnLCdDZW50ZXInLCdMZXZlbCcsJ1N0YXR1cycsJ09wdGlvbicsJ0Nob2ljZScsJ0NoYW5jZScsJ1Jpc2snLCdQbGFuJywnSWRlYScsJ0dvYWwnLCdEcmVhbScsJ1dpc2gnLCdPcmRlcicsJ1J1bGUnLCdHdWlkZScsJ01hcCcsJ0xpc3QnLCdDaGFydCcsJ0dyYXBoJywnVGFibGUnLCdUZXN0JywnRXhhbScsJ1F1aXonLCdMZXNzb24nLCdDbGFzcycsJ0NvdXJzZScsJ1NraWxsJywnVGFsZW50JywnQXJ0JywnU2NpZW5jZScsJ01hdGgnLCdIaXN0b3J5JywnR2VvZ3JhcGh5JywnUGh5c2ljcycsJ0NoZW1pc3RyeScsJ0Jpb2xvZ3knLCdFY29ub215JywnTWFya2V0JywnVHJhZGUnLCdCdXNpbmVzcycsJ0NvbXBhbnknLCdPZmZpY2UnLCdXb3JrZXInLCdNYW5hZ2VyJywnTGVhZGVyJywnQm9zcycsJ093bmVyJywnUGFydG5lcicsJ0NsaWVudCcsJ0N1c3RvbWVyJywnU2VydmljZScsJ1Byb2R1Y3QnLCdCcmFuZCcsJ01vZGVsJywnVmVyc2lvbicsJ01hcmtldCcsJ0luZHVzdHJ5JywnVGVjaG5vbG9neScsJ0Rlc2lnbicsJ1N0eWxlJywnUXVhbGl0eScsJ0ZlYXR1cmUnLCdGdW5jdGlvbicsJ1B1cnBvc2UnLCdFZmZlY3QnLCdDYXVzZScsJ1Jlc3VsdCcsJ1ZpY3RvcnknLCdGYWlsdXJlJywnU3VjY2VzcycsJ0VmZm9ydCcsJ0ZvY3VzJywnSG9ub3InLCdHbG9yeScsJ1RydXRoJywnRmFpdGgnLCdUcnVzdCcsJ1BlYWNlJywnV2FyJywnQmF0dGxlJywnRmlnaHQnLCdXZWFwb24nLCdTaGllbGQnLCdBcm1vcicsJ0ZsYWcnLCdTeW1ib2wnLCdTaWduJywnTWVzc2FnZScsJ05vdGljZScsJ05ld3MnLCdSZXBvcnQnLCdQYXBlcicsJ0FydGljbGUnLCdMZXR0ZXInLCdFbWFpbCcsJ1RleHQnLCdDaGF0JywnQ2FsbCcsJ1NpZ25hbCcsJ0FsZXJ0JywnV2FybmluZycsJ0RhbmdlcicsJ1NhZmV0eScsJ0hlYWx0aCcsJ0JvZHknLCdIZWFydCcsJ01pbmQnLCdCcmFpbicsJ0hhbmQnLCdGb290JywnRXllJywnRWFyJywnTW91dGgnLCdOb3NlJywnRmFjZScsJ0hhaXInLCdTa2luJywnQm9uZScsJ0Jsb29kJywnQnJlYXRoJywnTGlmZScsJ0RlYXRoJywnQmlydGgnLCdDaGlsZGhvb2QnLCdZb3V0aCcsJ0FkdWx0JywnRWxkZXInLCdGdXR1cmUnLCdQYXN0JywnUHJlc2VudCddXHJcbiAgICAgICAgdGhpcy53b3JkID0gd29yZExpc3RbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKndvcmRMaXN0Lmxlbmd0aCldXHJcbiAgICAgICAgd2hpbGUgKGdhbWUuaXNXb3JkT25EaXNwbGF5KHRoaXMud29yZCkpIHtcclxuICAgICAgICAgICAgdGhpcy53b3JkID0gd29yZExpc3RbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKndvcmRMaXN0Lmxlbmd0aCldXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMueCA9IHggLSB0aGlzLndvcmQubGVuZ3RoKjgvMlxyXG4gICAgICAgIHRoaXMueSA9IHkgKyAzMFxyXG4gICAgfVxyXG5cclxuICAgIGRyYXcoY3R4KSB7XHJcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIlxyXG4gICAgICAgIGN0eC5maWxsVGV4dCh0aGlzLndvcmQsIHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxuXHJcbiAgICBhY3Rpb24oKSB7XHJcbiAgICAgICAgLy90aGlzLnggKz0gTWF0aC5yYW5kb20oKSAqIDIgLSAxXHJcbiAgICAgICAgdGhpcy55ICs9IHRoaXMuc3BlZWRcclxuICAgICAgICAgICAgaWYgKHRoaXMueSA+IHdpbmRvdy5pbm5lckhlaWdodCAtIDgwKSB0aGlzLmRlc3Ryb3llZCA9IHRydWVcclxuICAgIH1cclxuXHJcbiAgICBjaGVja0NvbGxpc2lvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5nYW1lLmVsZW1lbnRMaXN0LmdldCh0aGlzLmNpcmNsZUlkKSA9PSBudWxsKSB7IC8vaWYgaXQgaXMgbnVsbCwgdGhhdCBtZWFucyB0aGUgY2lyY2xlIGhhcyBjb2xsaWRlZFxyXG4gICAgICAgICAgICB0aGlzLm9uQ29sbGlzaW9uKClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgb25Db2xsaXNpb24oKSB7XHJcbiAgICAgICAgdGhpcy5oYXNDb2xsaWRlZCA9IHRydWVcclxuICAgICAgICB0aGlzLmdhbWUuZWxlbWVudExpc3QuZGVsZXRlKHRoaXMuaW5zdGFuY2VJZCk7XHJcbiAgICAgICAgLyrDpG5kZXJ1bmdlbiB2b24gQnJpYW5cclxuICAgICAgICBpZiAodGhpcy5nYW1lLmFjdGl2ZVdvcmRFbGVtZW50ID09PSB0aGlzKXtcclxuICAgICAgICAgICAgdGhpcy5nYW1lLnJlc2V0QWN0aXZlV29yZCgpO1xyXG4gICAgICAgIH0qL1xyXG4gICAgfVxyXG59XHJcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBXb3JkSW5wdXRIYW5kbGVye1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5pbnB1dExpbmU9IG51bGw7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUlucHV0LmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExldHRlckNhbGxiYWNrKGNhbGxiYWNrKXtcclxuICAgICAgICB0aGlzLmlucHV0TGluZSA9IGNhbGxiYWNrO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUlucHV0KGV2ZW50KXtcclxuICAgICAgICBpZihldmVudC5rZXkubGVuZ3RoPT0xICYmIC9bYS16QS1aXS8udGVzdChldmVudC5rZXkpKXtcclxuICAgICAgICAgICAgY29uc3QgbGV0dGVyPSBldmVudC5rZXkudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmKHRoaXMuaW5wdXRMaW5lKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXRMaW5lKGxldHRlcik7XHJcbiAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICAvKlxyXG4gICAgbm90aWZ5KGxldHRlcil7XHJcbiAgICAgICAgLy9oaWVyIHdlcmRlbiBkaWUgYW5kZXJlbiBrbGFzc2VuIHZvbiBkZW0gbmV1ZW4gYnVjaHN0YWJlbiBub3RpZmllcnRcclxuICAgICAgICAvLyBldnRsIMO8YmVyZmzDvHNzaWdcclxuICAgIH1cclxuXHJcbiAgICBnZXRJbnB1dCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlucHV0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0SW5wdXQoKXtcclxuICAgICAgICB0aGlzLmlucHV0PSBcIlwiO1xyXG4gICAgfSovXHJcbn0iXX0=
